# Who Is Reviewing

A browser extension that tells the user the list of users reviewing a given pull request.  

### Description

This extension eliminates the case where a given pull request gets merged by one reviewer while the another reviewer is currently reviewing it. A user can toggle his/her status to started/stopped by opening the extension popup after navigating to the review page. The list of users who have started reviewing and not yet finished will be shown to all the users, just above the merge button of the pull request. The person who is going to merge the pull request can then know others who are currently reviewing and can contact them directly, if needed.

![image](https://user-images.githubusercontent.com/14849347/114347337-6e173300-9b82-11eb-8f5f-7f33f0c8920c.png)

![image](https://user-images.githubusercontent.com/14849347/114347404-84bd8a00-9b82-11eb-9b60-e54da234ff81.png)


### Config

Copy config.sample.js as config.js.

| Field | Type | Description | Default |
| ----- | ---- | ----------- | ------- |
| restEndPoint | String | Server base url | http://localhost:8000 |
| msg | Object | | |
| msg.userList | String | Message to indicate the list of users reviewing the PR | List of reviewing users : {USER_LIST} |

### Backend
Repository : [who-is-reviewing-backend](https://github.com/jijojames18/who-is-reviewing-backend)

### Documentation

- [Getting started](https://developer.chrome.com/docs/extensions/mv3/getstarted/)
- [Extensions Architecture](https://developer.chrome.com/docs/extensions/mv3/architecture-overview/)
