# Description

Node.JS, React, Socket.IO, React Context.

**How it works**

On the initial load we ask server to give as the list of the root directories, after that is received we render them as top level elements in our treeView. When user clicks on of the elements in the tree view, we ask server to give as the contents of the directory we request.

In the mean time there is file modification watch process on the backend, whenever some change occur, we sent that event into the browser. When React app in the browser receives such event, it adds or removes items from it's view accordingly.


# F.A.Q.

**Why Socket.IO ?**

Of course I could use some fancy stream API (which is included in fetch), or some other more or less complex solution, but Socket.IO is popular way to solve that, however I wouldn't use it in the real life. But don't forget, it's just a show case :)

**Why use React Context API ?**

In terms extensibility, it's always better to think that in the future we might need to extend our app with some other information, so Context usage is there just as a showcase of extensibility. Of course this particular app could be made without it.

**Things might not work, but can easily be fixed**

- Yes I know that this might not behave well on Microsoft Windows hosts because of it's different path addresation nature.
- If some item in the three was expanded and we decide to rename it or some of it's contents then it's collapsed, which is not nice. That's something I'm aware of, but handling such case would require more a bit more effort, which is I think not that important for our showcase.


# Build & Run

- Clone the repository
- Go into backend directory, and do ```npm install```
- After that do ```node file-explorer.js $DIR``` where $DIR is one or multiple directories you want to manage within file manager
- Go into frontend directory and do ```npm install```
- After that do ```npm start```, on success it will open the web-browser and redirect it to "http://localhost:3000/" (in case if on some reason this does not happen automatically, open web browser youself and paste this "http://localhost:3000/" into address bar).
