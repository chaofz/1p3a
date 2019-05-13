import sys
import time
from scraper import OnePointThreeAcresScraper


scraper = OnePointThreeAcresScraper()


def high_frequent_cycle():
  scraper.run_list_pages_concurrently(5)
  Timer(60 * 30, high_frequent_cycle).start()


def median_frequent_cycle():
  scraper.run_list_pages_concurrently(10)
  # scraper.run_task_content_pages(1)
  Timer(60 * 60 * 12, median_frequent_cycle).start()


if sys.argv[1] == 'base':
  print("Starting base task")
  scraper.run_list_pages_concurrently(1000)
  # scraper.run_task_content_pages(1000)
elif sys.argv[1] == 'watch':
  print("Starting watch task")
  median_frequent_cycle()
  time.sleep(60 * 30)
  high_frequent_cycle()
elif sys.argv[1] == 'quick':
  print("Starting quick task")
  scraper.run_list_pages_concurrently(1)
else:
  print('python task.py base | watch | quick')
