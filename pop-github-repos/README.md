# stuff I need to do for this challenge

- a list of repos created in the last 7 days with the most number of stars in github should be displayed and the user should be able to favorite them
- the favorited repos either through a filter or in a dif. tab.
  - basic info about the repo should be displayed like
    - repo name
    - description
    - number of stars
    - other stuff I want I guess
- the favorites can be stored locally

**bouns task: language filter would be awesome to have**

## impl. details

- github search endpoint: `https://api.github.com/search/repositories?q=created:%3E2017-01-10&sort=stars&order=desc`
