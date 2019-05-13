# -*- coding: utf-8 -*-

CONCURRENT_COUNT = 3
SLEEP_DURATION = 3

LIST_PAGE_URL = 'http://www.1point3acres.com/bbs/forum.php?mod=forumdisplay&fid={}&orderby=dateline&page={}'
CONTENT_PAGE_URL = 'http://www.1point3acres.com/bbs/forum.php?mod=viewthread'

INTERVIEW_EXPERIENCE_FID = 145
INTERNAL_REFERRAL_FID = 198
COMPANY_PACKAGE_FID = 237
COMPANY_INSIDE_FID = 287
CAREER_EXPERT_FID = 98
SYSTEM_DESIGN_FID = 323
PROGRAM_INTRODUCTION_FID = 71

forum_id_list = [INTERVIEW_EXPERIENCE_FID, INTERNAL_REFERRAL_FID, COMPANY_PACKAGE_FID, COMPANY_INSIDE_FID,
                 CAREER_EXPERT_FID, SYSTEM_DESIGN_FID, PROGRAM_INTRODUCTION_FID]

job_type_dict = {
  u'全职': 'fulltime',
  u'实习': 'intern',
}

fresh_or_switch_dict = {
  u'全职': 'fresh grad应届毕业生',
  u'实习': '在职跳槽',
}
