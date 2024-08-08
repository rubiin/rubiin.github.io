---
title: Mongoose dynamic update hack
published: true
description:
tags: Mongoose,nodejs,expressjs
cover_image: https://raw.githubusercontent.com/daton89-topperblues/mongoose-transactions/master/docs/img/mongoose-transactions.png
---

Why do you use mongoose you say?
Let’s face it, writing MongoDB validation, casting and business logic boilerplate is a drag. Mongoose eases the whole mess.
While working with mongoose specially on the update operation , you will notice that you will have to provide the selector for the document you are modifying (normally \_id or username ) along with the fields you wish to modify and their corresponding values that you would like to update.
Here is a simple snippet to summarize the whole thought above

```javascript
User.update({
"username": req.params.user} , {$set:
{age: req.body.age, location: req.body.location, name:req.body.name ....}
} ,
function (err , success) {
if (err) throw (err);
else {
res.send({
msg: 'update success'
})
}})
```

![](https://media.giphy.com/media/mCRJDo24UvJMA/giphy.gif)

The code is okay if you are to update two to handful of fields but its get kinda ugly as the field to be updated gets increased. Say 100 fields . Also if you do manage to write the update query for 100 fields , whats the chance that the properties names in the schema will remain the same forever. If the schema were to update, you will be writing 100+100 = 200 update assignments.
This is where my code comes to rescue. Not only it dynamically populates the update fields on the query , it also picks up the field name from the request.

```javascript
const entries = Object.keys(req.body)
const updates = {}

// constructing dynamic query

for (let i = 0; i < entries.length; i++) {
updates[entries[i]] = Object.values(req.body)[i]
}
User.update({
"username": req.params.user
} , {
$set: updates
} ,
function (err , success) {
if (err) throw (err);
else {
res.send({
msg: "update success"
})
}
}

```

![](https://media.giphy.com/media/RyXVu4ZW454IM/giphy.gif)

Happy Node'ing

[![Beerpay](https://beerpay.io/rubiin/nest-easyconfigs/badge.svg?style=beer)](https://beerpay.io/rubiin/nest-easyconfigs)
