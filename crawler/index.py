# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup
from pymongo import MongoClient
from datetime import datetime
from threading import Thread
from constants import *
import re
import requests
import time


def convert_job_type(job_type):
  return job_type_dict.get(job_type, 'other')


def convert_fresh_or_switch(fresh_or_fresh):
  return fresh_or_switch_dict.get(fresh_or_fresh, 'other')


def convert_interview_types(interview_types):
  return interview_types.replace(u'HR筛选', 'hr').replace(u'在线笔试', 'oa') \
    .replace(u'技术电面', 'phone').replace(u'校园招聘会', 'campus') \
    .replace(u'其他', 'other').replace('Onsite', 'onsite')


def build_soup(url):
  result = requests.get(url)
  content = result.content.decode('gbk', 'ignore').encode('utf-8')
  return BeautifulSoup(content, 'html.parser')


def generate_soup_and_post_rows(url, forum_name=None):
  soup = build_soup(url)
  rows = soup.findAll('tbody', id=re.compile('^normalthread'))
  post_rows = []
  for row in rows:
    post_rows.append(general_post_information(row, forum_name))
  return rows, post_rows


def general_post_information(row, forum_name=None):
  post = {}
  if forum_name is not None:
    post['postType'] = forum_name
  title_link = row.find('a', {'class': 's xst'})
  date = row.find('td', {'class': 'by'}).find('span').find('span')
  if date:
    date = date['title']
  else:
    date = row.find('td', {'class': 'by'}).find('em').find('span').get_text()
  post['tid'] = int(row['id'][row['id'].find('_') + 1:])
  post['title'] = title_link.get_text().strip(' \t\n\r')
  post['sourceUrl'] = '{}&tid={}'.format(CONTENT_PAGE_URL, post['tid'])
  post['createdDate'] = datetime.strptime(date, "%Y-%m-%d")
  author_a = row.find('a', {'c': '1'})
  post['author'] = author_a.get_text() if author_a else u'匿名'
  post['views'] = int(row.find('td', {'class': 'num'}).find('em').get_text())
  return post


class OnePointThreeAcresScraper:
  def __init__(self):
    client = MongoClient('mongodb://localhost:27017/')
    self.db_posts = client.onePoint3Acres.posts

  def scrape_interview_experience_list_page(self, url, page_num):
    rows, post_rows = generate_soup_and_post_rows(url)
    for row, post in zip(rows, post_rows):
      post['postType'] = 'Interview Experience'
      detail = row.find('th').find('span')
      if detail.has_attr('style'):
        if detail.find('font', {'color': '#666'}) is None:
          continue
        post['seekTime'] = detail.find('font', {'color': '#666'}).get_text().replace(u'月', '')
        post['jobField'] = detail.find('font', {'color': 'green'}).get_text()
        post['highestDegree'] = detail.findAll('b')[1].get_text()
        post['jobType'] = convert_job_type(detail.find('font', {'color': '#00B2E8'}).get_text())
        post['companyName'] = detail.find('font', {'color': '#FF6600'}).get_text().lower().replace(" ", "")
        sub = detail.get_text()
        post['interviewResult'] = detail.find('font', {'color': 'purple'}).get_text().lower()
        post['interviewTypes'] = convert_interview_types(sub[sub.rfind('-') + 1: sub.find('|')]).split()
        sub = detail.get_text()[detail.get_text().rfind("|") + 1:].strip(' \t\n\r')
        post['freshOrSwitch'] = convert_fresh_or_switch(sub[1:]) if sub.startswith('O') else convert_fresh_or_switch(
          sub)
      self.db_posts.update({'tid': post['tid']}, {'$set': post}, True)
    print ("Finished interview experience list page", page_num)

  def scrape_internal_referral_list_page(self, url, page_num):
    rows, post_rows = generate_soup_and_post_rows(url, 'Referral')
    for row, post in zip(rows, post_rows):
      post['companyName'] = row.find('font', {'color': '#00B2E8'}).get_text().lower().replace(" ", "")
      self.db_posts.update({'tid': post['tid']}, {'$set': post}, True)
    print ("Finished internal referral list page", page_num)

  def scrape_company_package_list_page(self, url, page_num):
    rows, post_rows = generate_soup_and_post_rows(url, 'Package')
    for row, post in zip(rows, post_rows):
      post['companyName'] = row.find('font', {'color': '#FF6600'}).get_text().lower().replace(" ", "")
      post['experience'] = row.find('font', {'color': '#00B2E8'}).get_text()
      detail = row.find('th').get_text()
      arrow_index = detail.rfind("->")
      right_index = detail.rfind("]")
      post['level'] = detail[arrow_index + 2:right_index + 1].strip(' \t\n\r')
      self.db_posts.update({'tid': post['tid']}, {'$set': post}, True)
    print ("Finished company package list page", page_num)

  def scrape_company_inside_list_page(self, url, page_num):
    rows, post_rows = generate_soup_and_post_rows(url, 'Company Inside')
    for row, post in zip(rows, post_rows):
      post['recommendation'] = row.find('font', {'color': '#FF6600'}).get_text()
      post['companyName'] = row.find('font', {'color': '#497b89'}).get_text().lower().replace(" ", "")
      post['experience'] = row.find('font', {'color': '#00B2E8'}).get_text()
      detail = row.find('th').get_text()
      left_index, at_index = detail.find("["), detail.rfind("@")
      post['level'] = detail[left_index:at_index].strip(' \t\n\r')
      post['area'] = detail[at_index + 1:].strip(' \t\n\r')
      self.db_posts.update({'tid': post['tid']}, {'$set': post}, True)
    print ("Finished company inside list page", page_num)

  def scrape_standard_list_page(self, url, forum_name, page_num):
    _, post_rows = generate_soup_and_post_rows(url, forum_name)
    for post in post_rows:
      self.db_posts.update({'tid': post['tid']}, {'$set': post}, True)
    print ("Finished {} list page {}".format(forum_name, page_num))

  def scrape_list_page(self, fid, url, page_num):
    if fid == INTERVIEW_EXPERIENCE_FID:
      self.scrape_interview_experience_list_page(url, page_num)
    elif fid == INTERNAL_REFERRAL_FID:
      self.scrape_internal_referral_list_page(url, page_num)
    elif fid == COMPANY_PACKAGE_FID:
      self.scrape_company_package_list_page(url, page_num)
    elif fid == COMPANY_INSIDE_FID:
      self.scrape_company_inside_list_page(url, page_num)
    elif fid == CAREER_EXPERT_FID:
      self.scrape_standard_list_page(url, 'Career Expert', page_num)
    elif fid == SYSTEM_DESIGN_FID:
      self.scrape_standard_list_page(url, 'System Design', page_num)
    elif fid == PROGRAM_INTRODUCTION_FID:
      self.scrape_standard_list_page(url, 'Program Introduction', page_num)

  def run_list_pages_concurrently(self, num_page):  # per 1 hr for 1 page
    page_num = 1
    while page_num <= num_page:
      page_urls = []
      concurrent_idx = 0
      while concurrent_idx < CONCURRENT_COUNT and page_num <= num_page:
        for fid in forum_id_list:
          list_page = {
            'fid': fid,
            'url': LIST_PAGE_URL.format(fid, page_num),
            'page_num': page_num,
          }
          page_urls.append(list_page)
        concurrent_idx += 1
        page_num += 1
        threads = [
          Thread(target=self.scrape_list_page, args=(list_page['fid'], list_page['url'], list_page['page_num'])) for
          list_page in page_urls]
        [x.start() for x in threads]
        [x.join() for x in threads]
        time.sleep(SLEEP_DURATION)
      print ('Finished a concurrent list page group')

  def scrape_content_page(self, tid, url):
    result = requests.get(url)
    soup = BeautifulSoup(result.content, 'html.parser')
    post = {}
    content_div = soup.find('td', id=re.compile('^postmessage_'))
    # content_div = soup.find('div', { 'class': 'message' })
    # dateDiv = soup.find('div', {'class': 'pti'}).find('em').find('span')
    # date = dateDiv['title']
    print "url", url
    print "content_div", content_div
    if content_div:
      post['content'] = content_div.prettify()
    post['contentScraped'] = True

    self.db_posts.update({'tid': tid}, {'$set': post})
    print ("Finished post page", tid)

  def run_task_content_pages(self, num_list_page):  # per 1 hr
    limit = 50 * num_list_page
    db_posts = self.db_posts.find({'contentScraped': {'$exists': False}}).sort('tid', -1).limit(limit)
    posts = []
    for post in db_posts:
      _post = {
        'tid': post['tid'],
        'url': '{}&tid={}'.format(CONTENT_PAGE_URL, post['tid']),
      }
      posts.append(_post)
    num_page = len(posts)
    page_index = 0
    while page_index < num_page:
      i = 0
      page_urls = []
      while i < CONCURRENT_COUNT and page_index < num_page:
        content_page = posts[page_index]
        page_urls.append(content_page)
        page_index += 1
        i += 1
      threads = [Thread(target=self.scrape_content_page, args=(content_page['tid'], content_page['url'])) for
                 content_page in page_urls]
      [x.start() for x in threads]
      [x.join() for x in threads]
      time.sleep(SLEEP_DURATION)
