import sys
import time
from index import OnePointThreeAcres
from threading import Timer

MOBILE_PAGE_URL = 'http://www.1point3acres.com/bbs/forum.php?mod=viewthread&mobile=1'

instance = OnePointThreeAcres();

def full_base_setup(): # just run once
  print("Starting full base-term setup")
  instance.task_list_pages(390)
  instance.task_content_pages(390)

def short_base_setup(): # just run once
  print("Starting short base-term setup")
  instance.task_list_pages(100)
  instance.task_content_pages(100)

def short_task():
  instance.task_list_pages(1)
  instance.task_content_pages(1)

def short_cycle():
  print("Starting short-term updating")
  short_task()
  Timer(60 * 30, short_cycle).start()

def median_cycle():
  print("Starting median-term updating")
  instance.task_list_pages(5)
  instance.task_content_pages(5)
  Timer(60 * 60 * 12, median_cycle).start()


if sys.argv[1] == 'base':
  full_base_setup()
  
elif sys.argv[1] == 'short':
  short_base_setup()

elif sys.argv[1] == 'quick':
  print("Starting quick task")
  short_task()

elif sys.argv[1] == 'watch':
  median_cycle()
  time.sleep(60 * 30)
  short_cycle()

elif sys.argv[1] == 'test':
  instance.scrape_content_page(sys.argv[2], MOBILE_PAGE_URL + '&tid=' + sys.argv[2])
  
else:
  print('Run "python run.py base | short | quick | watch"')
