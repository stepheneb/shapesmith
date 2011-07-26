---
layout: post
title: Welcome to Shapesmith
---

<p>This has taken a bit longer than I had hoped! Welcome to the Shapesmith blog and my first post about <a href="http://www.shapesmith.net">shapesmith.net</a>. This is a quick update on the project and the plans for the near future.</p>

<p>Since <a href="http://www.1011ltd.com/web/blog/post/im_building_a_webgl_tool">posting on my blog</a> about working on this project, progress has been steady but slow. I have made some progress in terms of user features (such as undo/redo, saving of models and validation), but the majority of work has gone into making the backend lean and mean. Most noteworthy is the separation of api, database and worker components.
</p>

<p>
The success of a cloud-based Shapesmith depends very much on addressing the scalability of BRep operations, or, effectively using processing power for multiple users. For deploying a local solution (for example on a school network), this is not as important a consideration, but a hosted Shapesmith needs to be very effective with processor utilisation in order to contain the hosting cost. &quot;Traditional&quot; LAMP web applications don't use a lot of processing power per user action, whereas BRep operations are by nature N cubed and require an architecture that is sentisive to this fact. The good news is that it makes the optimisation path clear - BRep operations take much longer than database operations, serializing and deserializing data, validation, etc, and I can optmize taking this into account.
</p>

<p>
Is it worth mentioning that I have now transitioned to using an actual database, <a href="http://www.basho.com/products_riak_overview.php">Riak</a>, and have switched to the community version of OpenCASCADE, <a href="https://github.com/tpaviot/oce">OCE</a>. This is an important step for users to be able to install their own local version of Shapesmith with a stable data store and BRep library. OCE is a new community effort to improve on some of the shortcomings of OpenCASCADE, and I am pleased with the results so far (especially the cross -platform build support). I will not go into the architecture in detail in this post, but the design can accomodate scaling the application in 3 dimensions, the API nodes which handle the ReSTful calls, the DB nodes, and the worker nodes which perform the BRep operations:
</p>

<div class="center"><img src="img/architecture.png" alt="architecture"></img></div>

<p>
On to <a href="http://shapesmith.net">shapesmith.net</a>. I have deployed an up-to-date version of Shapesmith to an Amazon EC2 instance for a while now. The goal was to examine the behaviour of the application in a live and long-running environment. This has led to some of the backend improvements I have already mentioned. I have been encouraged by the performance of the app on such a small instance (with low memory and processing power). I have now upgraded the instance to an EC2 small instance with more memory and processing power, as well as moving to using Riak and OCE. You are welcome to experiment with <a href="http://shapesmith.net">shapesmith.net</a> as long as you keep in mind that it is still a preview, and I have disabled the saving of models for the moment until the model format stabilises (see below). I welcome any feedback by <script>document.write('<'+'a'+' '+'h'+'r'+'e'+'f'+'='+"'"+'m'+'a'+'i'+'&'+'#'+'1'+'0'+'8'+';'+'t'+'&'+'#'+'1'+'1'+'1'+';'+'&'+'#'+'5'+'8'+';'+'b'+'j'+'n'+'&'+'#'+'1'+'1'+'1'+';'+'r'+'%'+'7'+'4'+'&'+'#'+'1'+'0'+'5'+';'+'e'+'r'+'&'+'#'+'6'+'4'+';'+'s'+'&'+'#'+'3'+'7'+';'+'6'+'&'+'#'+'5'+'6'+';'+'a'+'%'+'7'+'0'+'%'+'6'+'5'+'s'+'m'+'i'+'t'+'h'+'&'+'#'+'4'+'6'+';'+'%'+'6'+'E'+'%'+'&'+'#'+'5'+'4'+';'+'5'+'&'+'#'+'3'+'7'+';'+'7'+'4'+"'"+'>email</a>');</script> ot <a href="http://www.twitter.com/shapesmith">@shapesmith</a>.
</p>

<p>
What are the plans for the future? In roughly the following order I plan to:
</p>
<ol>
<li>Get the instructions up to date for users who want to run a local version.</li>
<li>Introduce a workplace in the user interface. This will make building models a lot easier, and will include a grid system, along with point-and-click object placement. This will require a change in the representation of models in the database, which is why shapesmith.net doesn't have the saving of models enabled.</li>
<li>1D and 2D geometry such as lines, curves, polygons, etc.</li>
<li>1D to 2D operations and 2D to 3D operations such as extrusions.</li>
<li>Introduce on-demand worker instances (i.e. use more worker nodes when more users are using the application).</li>
<li>Introduce variables as a way of specifying model dimensions etc.</li>
</ol>

<p>
There is a lot of work to do, but I continue to believe that a 3D modelling application in a browser that is accessible to everyone, an open to modification, is important to make the economic advantages of 3D printing available to a large audience.
</p>

<p>
Stay tuned, and follow <a href="http://www.twitter.com/shapesmith">@shapesmith</a> for updates.
</p>