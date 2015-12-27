# md-contact

[Heroku App](https://md-contact.herokuapp.com/#/contact/list){:target="_blank"}

##folder structure

- modules
  * app
    * js
      * app.module.js
    * views
      * layout.jade 
  * contact
    * index.js (node-express rest api for contact) 
    * js
      * contact.module.js
      * contact.service.js
      * contact.ctrl.js
      * contact-list.ctrl.js
      * contact-detail.ctrl.js
      * contact-form.ctrl.js
    * views
      * contact.jade
      * contact-list.jade
      * contact-detail.jade
      * contact-form.jade
    * data
      * contacts.json
    * tests
      * contact.spec.js
* public
  * index.html
  * bundle.js
  * bundle.min.js
  * modules (compiled views)
    * app
      * views
        * layout.html 
    * contact
      * views
        * contact.html
        * contact-list.html
        * contact-detail.html
        * contact-form.html
