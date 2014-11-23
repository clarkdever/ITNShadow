# infoTech Niagara Shadow Program Website

It uses [startbootstrap-agency] (https://github.com/IronSummitMedia/startbootstrap-agency) as a base for it's design and layout.

## How to use this website


### Prerequisites

You need git to clone the angularfire-seed repository. You can get it from
[http://git-scm.com/](http://git-scm.com/).  


```
git clone https://github.com/clarkdever/ITNShadow.git
cd ITNShadow
```

## Directory Layout

    app/                  --> all of the files to be used in production
      css/                --> css files
       agency.css           --> default stylesheet
      img/                --> image files
      index.html          --> app layout file (the main html template file of the app)
      js/                 --> javascript files
        app.js            --> application
        routes.js         --> routing and route security for the app
      partials/           --> angular view partials (partial html templates)
        account.html
        companies.html
        contact.html
        home.html
        info.html
        register.html
        students.html


### Running the App during Development

If you have node installed.

```
sudo npm install -g http-server
```

Then you can start your own development web server to serve static files from a folder by
running:

```
http-server
```

Alternatively, you can choose to configure your own webserver, such as apache or nginx. Just
configure your server to serve the files under the `app/` directory.

## Contact

Clark Dever: clarkdever@gmail.com

For more information on AngularJS please check out http://angularjs.org/

[git](http://git-scm.com/)

[npm](https://www.npmjs.org/)

[node](http://nodejs.org)

[http-server](https://github.com/nodeapps/http-server)

[agency-bootstrap](https://github.com/IronSummitMedia/startbootstrap-agency)

