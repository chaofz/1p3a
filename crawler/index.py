#!/usr/bin/env python
# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup
from pymongo import MongoClient
from datetime import datetime
from threading import Thread
import re
import requests
import time

CONCURRENT = 3;
SLEEP_DURATION = 3;
LIST_PAGE_URL = 'http://www.1point3acres.com/bbs/forum.php?mod=forumdisplay&fid=145&orderby=dateline'
CONTENT_PAGE_URL = 'http://www.1point3acres.com/bbs/forum.php?mod=viewthread'
MOBILE_PAGE_URL = 'http://www.1point3acres.com/bbs/forum.php?mod=viewthread&mobile=1'
  
def jobType(jobType):
  if jobType == u'全职':
    return 'fulltime'
  if jobType == u'实习':
    return 'intern'
  return 'other'

def freshOrSwitch(freshOrSwitch):
  if freshOrSwitch == u'fresh grad应届毕业生':
    return 'fresh'
  if freshOrSwitch == u'在职跳槽':
    return 'switch'
  return 'other'

def interviewTypes(interviewTypes):
  return interviewTypes.replace(u'HR筛选', 'hr').replace(u'在线笔试', 'oa').replace(u'技术电面', 'phone').replace(u'校园招聘会', 'campus').replace(u'其他', 'other').replace('Onsite', 'onsite')

class OnePointThreeAcres:
  def __init__(self):
    client = MongoClient('mongodb://localhost:27017/')
    self.db_posts = client.onePoint3Acres.posts

  def build_soup(self, url):
    result = requests.get(url)
    content = result.content.decode('gbk', 'ignore').encode('utf-8')
    return BeautifulSoup(content, 'html.parser')

  def scrape_list_page(self, url, page_num):
    soup = self.build_soup(url)
    rows = soup.findAll('tbody', id=re.compile('^normalthread'))
    for row in rows:
      post = {}
      title_link = row.find('a', { 'class' : 's xst' })
      date = row.find('td', { 'class' : 'by' }).find('span').find('span')
      if date:
        date = date['title']
      else:
        date = row.find('td', { 'class' : 'by' }).find('em').find('span').get_text()

      post['tid'] = int(row['id'][row['id'].find('_') + 1:])
      post['title'] = title_link.get_text().strip(' \t\n\r')
      post['sourceUrl'] = MOBILE_PAGE_URL + '&tid=' + str(post['tid'])
      post['createdDate'] = datetime.strptime(date, "%Y-%m-%d")

      post['author'] = row.find('a', {'c': '1'}).get_text()
      post['views'] = int(row.find('td', {'class':'num'}).find('em').get_text())
      detail = row.find('th').find('span')
      
      if detail.has_attr('style'):
        post['seekTime'] = detail.find('font', {'color': '#666'}).get_text().replace(u'月', '')
        post['jobField'] = detail.find('font', {'color': 'green'}).get_text()
        post['highestDegree'] = detail.findAll('b')[1].get_text()
        post['jobType'] = jobType(detail.find('font', {'color': '#00B2E8'}).get_text())
        post['companyName'] = detail.find('font', {'color': '#FF6600'}).get_text().lower().replace(" ", "")
        sub = detail.get_text()
        post['interviewResult'] = detail.find('font', {'color': 'purple'}).get_text().lower()
        post['interviewTypes'] = interviewTypes(sub[sub.rfind('-') + 1: sub.find('|')]).split()
        sub = detail.get_text()[detail.get_text().rfind("|") + 1:].strip(' \t\n\r')
        if sub.startswith('O'):
          post['freshOrSwitch'] = freshOrSwitch(sub[1:])
        else:
          post['freshOrSwitch'] = freshOrSwitch(sub)

      self.db_posts.update({'tid': post['tid']}, {'$set': post}, True)

    print ("Finished list page", page_num)

  def scrape_content_page(self, tid, url):
    result = requests.get(url)
    soup = BeautifulSoup(result.content, 'html.parser')
    post = {}
    contentDiv = soup.find('div', id=re.compile('^postmessage_'))
    # dateDiv = soup.find('div', {'class': 'pti'}).find('em').find('span')
    # date = dateDiv['title']
    if(contentDiv):
      post['content'] = contentDiv.prettify()
    post['contentScraped'] = True

    self.db_posts.update({'tid': tid}, {'$set': post})
    print ("Finished post page", tid)

  def task_content_pages(self, num_list_page): # per 1 hr
    LIMIT = 50 * num_list_page;
    db_posts = self.db_posts.find({'contentScraped': {'$exists': False}}).sort('tid', -1).limit(LIMIT);
    posts = []
    for post in db_posts:
      _post = {}
      _post['tid'] = post['tid'];
      _post['url'] = CONTENT_PAGE_URL + '&mobile=1&tid=' + str(_post['tid'])
      posts.append(_post)
    num_page = len(posts)
    page_index = 0;
    while(page_index < num_page):
      i = 0;
      page_urls = []
      while (i < CONCURRENT and page_index < num_page):
        content_page = posts[page_index]
        page_urls.append(content_page)
        page_index += 1;
        i += 1;
      threads = [Thread(target=self.scrape_content_page, args=(content_page['tid'], content_page['url'])) for content_page in page_urls]
      [x.start() for x in threads]
      [x.join() for x in threads]
      time.sleep(SLEEP_DURATION)

  def task_list_pages(self, num_page): # per 1 hr for 1 page
    page_num = 1;
    while (page_num <= num_page):
      i = 0;
      page_urls = []
      while (i < CONCURRENT and page_num <= num_page):
        list_page = {}
        list_page['url'] = LIST_PAGE_URL + '&page=' + str(page_num)
        list_page['page_num'] = page_num;
        page_urls.append(list_page)
        page_num += 1;
        i += 1;
      threads = [Thread(target=self.scrape_list_page, args=(list_page['url'], list_page['page_num'])) for list_page in page_urls]
      [x.start() for x in threads]
      [x.join() for x in threads]
      time.sleep(SLEEP_DURATION)
      # print ('Finished a concurrent list page group')
