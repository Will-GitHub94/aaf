# aaf
#### University assignment
<br>

This project uses [MeanJS](http://meanjs.org/) (*a full-stack javascript framework*)

###### Prerequisites:
1. Make sure `bower` is installed:<br>
   `npm install -g bower`
   
2. Make sure `grunt-cli` is installed:<br>
   `npm install -g grunt-cli`
   
3. Make sure `generator-meanjs` is installed:<br>
   `npm install -g generator-meanjs`
   
4. Make sure `yo` is installed:<br>
   `npm install -g yo`

3. Make sure `ruby` and it's package manager `rubygem` are installed:<br>
   *For Mac:* These should be installed by default<br>
   *For Windows:* I found [this](https://forwardhq.com/help/installing-ruby-windows) useful
   
4. Make sure `sass` is installed (*via the `rubygem` package manager*):<br>
   `gem install -g sass`


**NOTE:** All packages can either be installed globally (using `-g` option) or locally in your project directory

---


###### Installation 
<small>(*I like [this](https://www.youtube.com/watch?v=XHpMH_5n2fQ) video* - by MEANJS)</small>

1. Create a directory to store your app in
2. Run `yo meanjs`
3. Work through all associated questions
4. Once installed, run `grunt` and go to `localhost:3000` and you should see the MEANJS landing page

---

###### Specific to this repo

If on a new machine then clone this repo, create a separate MEANJS app using the steps above in another directory. Copy across directories:
1. `.bluemix`
2. `public`

...into the cloned repo directory

Run `npm install`<br>
Run `grunt` to make sure everything is ok!
