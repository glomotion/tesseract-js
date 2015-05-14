tesseract
=========

Server does all the heavy lifting, only notifying the client what it requests for.

* Robust event management system. Promises. For the Win.
* Store data like you would SQL but in JSON. (no brainer)
* Query data like its SQL - then do lots of awsome shit. Server side.
* "As a javascript developer I like to chain things - they're more real when they're chained" - tim.
* server is Python only (ham and eggs - bitch!)




Roadmap to ALPHA:
-------
* **integrate o-auth for queries etc**
* Instant use dummy data (eg start project with a dummy data JSON object? - document this on the website) - Elliot
* better CLI help instructions - elliot
* CLI/NPM install script - elliot
* help text on queries that are possible eg "man tesseract" - elliot
* Dont crash on invalid queries - elliot
* Dependencies installed upon tesseract - elliot ? target command "$ pip install tesseract"
* Setup an instance for demo hosting - elliot
* logo (for free) - tim
* multiple domains (find variations + buy) - both
* documentation for web (make elliot's rubbish usable) - tim
* documentation for github repo - elliot (+= tim to make less shit)
* copy for web (ask jonny to help) - tim (+= Jonny + Jude)
  * IDEA: complex data+query = how much data bandwith was used
* wider use case examples [angular, react/flux, '?' - tim && elliot && ['rochey'||'jess'||'jude'||'all' awesome ppl'] 
* bullet proof server (eg. Tim can't crash it in 2 seconds)- elliot
* client unit tests (all methods are supported and working) - elliot
* all written tests pass for all builds of the server - elliot
** device testing (query perf - what happens when connection gets lost on shitty 2g)- tim - low prio
* issue tracking (github) - elliot
* open source vs MIT? terms license (probably MIT) - elliot
* pretty demo apps - all
* autho on demo server


Caveats
-------

Speed.(?)

Redis requiers memory for all items stored.

### Dependencies

Lua
Not javascript

### Lua

Type sensivitivty in terms of comparing any variable that is tdiffernt type. For example:

3 = "3"
> false

3 = tonumber("3")
> true

require("tesseract");
var db = tesseract.connect('labs.tesseract.com', 'tim@glo.com', 'mypass');
