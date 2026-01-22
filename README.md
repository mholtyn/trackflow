## 1. What is trackflow?
Trackflow is a B2B platform for managing music demo submissions as structured, event-driven workflows, instead of email threads and links.

## 2. What problem does it solve and for who?
Communication between labels and producers when it comes to submitting demos and releasing EP's, albums and singles is not a straightforward process as it may first seem. Often being a long and frustrating process it can leave both parties dissatisfied and waste unneccesary energy.

Producers hate sending hundreds of emails towards "demo black holes", where they never get replied to, literally feeling as if they are sending out CV's applying for a job. The main tools that they use are their emails and track sharing sites such as Soundcloud, Youtube, Hearthis, sometimes creating Google sheets to track the status of their submissions. 

Label managers on the other hand dislike receiving unformatted e-mails poiting towards different sites, with different formats and without clear crucial metadata such as the track name, genre, vibe, tempo, key etc. They lack having a standardized way of managing demos where they can easily filter and manage releases aswell as communicate with artists.

## 3. How does the basic user flow look like?
A new user is greeted by a welcome page where they can choose to either log in or register. After clicking the register button they are taken to a typical form where they have to decide whether the account they are making is of type producer or label member. 

If they created a producer account, after successful authorization, they will be taken to their own producer portal where they can:
- update their profile info,
- manage their tracks (create, update, delete, read),
- make new submissions and/or change the status of existing ones,
- monitor their submissions status history,
- log out.


If they chose their user type to be of label member, upon successful log in they are taken to their label profile portal where they can:
- update their profile info,
- create a new workspace (label),
- access their label panels (either by creating one, or by invited to one),
- manage the labels info and members if they are the label admin,
- review submissions and update the status of existing ones,
- monitor their label's submsission status history,
- log out.


## 4. What are the main domain concepts?
Trackflow at the MVP stage has 4 aggregate root entities which are:
1. Users,
2. Tracks,
3. Workspaces (labels),
4. Submissions.

Every user must be of either a ProducerProfile type or LabelstaffProfile type. They cannot chose to be both at the same time. In cases where label managers are also producers themselves they must create a dedicated producer account.

Producers don't submit tracks to labels directly, instead snapshots with necessary and current metadata are taken and these are being processed further.

Submissions follow a strict State Workflow Machine. On top of that there also SubmissionEvents which are immutable objects representing a submission state transition in time.


## 5. What is not implemented?
Many features have been left out at the current stage. No social component exists on this stage where labels and producers could exchange comments or messages directly. No advanced filtering has been implemented yet. Dashboard contain the absolute bare minimum information in order for the plaftorm to work. No anti ghosting measures have been taken so far (!). No submission validation exists where the backend checks for broken links. And lastly, no minimal frontend yet.


# Trackflow
Trackflow is blablablabalba