# Who Is Reviewing

A browser extension that tells the user the list of users reviewing a given pull request.  

### Description

This extension eliminates the case where a given pull request gets merged by one reviewer while another reviewer is currently reviewing it. A user can toggle his/her status to started/stopped by opening the extension popup after navigating to the review page. The list of users who have started reviewing and not yet finished will be shown to all the users, just above the merge button of the pull request. The person who is going to merge the pull request can then know others who are currently reviewing and can contact them directly if needed.

*Until the user starts reviewing, the 'Files Changed' tab is disabled and cannot be accessed by clicking on the corresponding link. This is done as a precautionary measure to prevent users from forgetting to toggle the status when they start reviewing.*

![image](https://user-images.githubusercontent.com/14849347/114347337-6e173300-9b82-11eb-8f5f-7f33f0c8920c.png)

![image](https://user-images.githubusercontent.com/14849347/114347404-84bd8a00-9b82-11eb-9b60-e54da234ff81.png)


### Config

Copy config.sample.js as config.js.

| Field | Type | Description | Default |
| ----- | ---- | ----------- | ------- |
| restEndPoint | String | Server base URL | http://localhost:8000 |
| msg | Object | | |
| msg.userList | String | Message to indicate the list of users reviewing the PR | List of reviewing users : {USER_LIST} |
| msg.noActiveReviewers | String | Message to shown when there are no active reviewers | No one is currently reviewing this pull request. |
| msg.toggleMessage | String | Toggle message used in Popup | Are you reviewing this pull request? |
| msg.toggleYes | String | Message to indicate I am reviewing this pull request | Yes |
| msg.toggleNo | String | Message to indicate I am not reviewing this pull request | No |
| msg.fallbackMessage | String | Message shown in Popup when user is not in an active pull request | Navigate to an open pull request to enable extension |

### Backend
Repository : [who-is-reviewing-backend](https://github.com/jijojames18/who-is-reviewing-backend)

### Available Scripts

In the project directory, you can run:

#### `npm run build`

Builds the project into the `build` folder.

#### `npm run dev`

Watches for changes to the `src` folder and builds the project when changes happen.

### Documentation

- [Getting started](https://developer.chrome.com/docs/extensions/mv3/getstarted/)
- [Extensions Architecture](https://developer.chrome.com/docs/extensions/mv3/architecture-overview/)
