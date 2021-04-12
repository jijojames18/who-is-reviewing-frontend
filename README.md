# Who Is Reviewing

A browser extension that tells the user the list of users reviewing a given pull request.  

### Description

This extension eliminates the case where a given pull request gets merged by one reviewer while the another reviewer is currently reviewing it. A user can toggle his/her status to started/stopped by opening the extension popup after navigating to the review page. The list of users who have started reviewing and not yet finished will be shown to all the users, just above the merge button of the pull request. The person who is going to merge the pull request can then know others who are currently reviewing and can contact them directly, if needed.

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
