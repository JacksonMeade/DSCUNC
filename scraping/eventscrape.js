var parser = new DOMParser();
var doc = new Document();

const unc_site = "https://dsc.community.dev/the-university-of-north-carolina-at-chapel-hill/";
const proxy_url = "https://cors-anywhere.herokuapp.com/";


function decodeSpecChar(inx) {
    return inx.replace(/\&amp;/g, "&").replace(/\&gt;/g, ">").replace(/\&lt;/g, "<").replace(/\&quot;/g, '"');
}

var pastEvents = [];
var upcomingEvents = [];
fetch(proxy_url+unc_site).then(function (response) {
	// The API call was successful!
	return response.text();
}).then(function (html) {
	// This is the HTML from our response as a text string
    //console.log(html);
    doc = parser.parseFromString(html, "text/html");
    
    pastEvents = getEvents(doc, "past-events");
    upcomingEvents = getEvents(doc, "upcoming-events");

    var pastEventsHTML = generateCardsHTML(pastEvents);
    var upcomingEventsHTML = generateCardsHTML(upcomingEvents);

    document.getElementsByClassName("col-12 card-inserts-container")[0].innerHTML = upcomingEventsHTML+pastEventsHTML;
    
}).catch(function (err) {
	// There was an error
	console.warn('Something went wrong.', err);
});



const dsc_event = {
    title: "",
    image_link: "",
    date: "",
    description: "",
    type: ""
};

function getEvents(docs, eType) {
    var temp = docs.getElementById(eType);
    if (temp==null) return [];
    var temp2 = temp.querySelector("ul");
    if (temp2==null) return [];

    
    var past = temp2.childNodes;
    var object_list = [];
    for (let i=0; i<past.length; i++)
    {
        let item_e = past[i];
        if (item_e.className === "vertical-box-container")
        {
            const ev = Object.create(dsc_event);
            for (let j=0; j<item_e.children.length; j++)
            {
                let child_att = item_e.children[j];
                if (j==0){
                    let img_s = child_att.outerHTML.split("src=\"")[1];
                    ev.image_link = img_s.substring(0,img_s.length-2);
                } else if (j==1)
                {
                    ev.date = child_att.outerText.trim();
                }
                else if (j==2) {
                    ev.type = child_att.innerText.trim();
                } else if (j==3) {
                    ev.title = child_att.innerText.trim().split("The University of North Carolina at Chapel Hill")[0];
                }
            }
            object_list.push(ev);
        }
    }
    return object_list;
}

function generateCard(event_object)
{
    /*
    <div class="row">
          <div class="col-5 card-inserts-profile">
              <img class="profile" src="assets/images/FireBase_Test.jpg" alt="No Profile">
          </div>
          <div class="col-7">
            <div class="style-bold style-fonts-style align-left pt-3 display-2">
                 Firebase Event
            </div>
            <div class="style-fonts-style align-left display-5">
                 Workshop
            </div>
            <div class="style-fonts-style align-left display-8">
                 <a class ="tag">Firebase Series, Part 1</a>
            </div>
            <div class="style-fonts-style align-left display-5">
                 DATE
            </div>
            <div class="">
              <p class="style-light style-fonts-style align-left pt-2 display-7">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
            <div class="style-section-btn align-center py-2">
                <a class="btn btn-md btn-secondary display-4" href="#">RSVP</a>
                <a class="btn btn-md btn-secondary display-4" href="#">Learn More</a>
            </div>
          </div>
        </div>
    */
   var out = "<div class=\"row\">";
   out += "<div class=\"col-5 card-inserts-profile\">";
   out += "<img class=\"profile\" src=\"" + event_object.image_link + "\" alt=\"No Profile\">";
   out += "</div>";
   out += "<div class=\"col-7\">";
   out += "<div class=\"style-bold style-fonts-style align-left pt-3 display-2\">";
   out += event_object.title;
   out += "</div>";
   out += "<div class=\"style-fonts-style align-left display-5\">";
   out += event_object.type;
   out += "</div>";
   out += "<div class=\"style-fonts-style align-left display-8\">";
   out += "<a class =\"tag\">" + event_object.type + "</a>";
   out += "</div>";
   out += "<div class=\"style-fonts-style align-left display-5\">";
   out += event_object.date;
   out += "</div>";
   out += "<div class=\"\">";
   out += "<p class=\"style-light style-fonts-style align-left pt-2 display-7\">" + event_object.description + "</p>";
   out += "</div>";
   out += "<div class=\"style-section-btn align-center py-2\">";
   out += "<a class=\"btn btn-md btn-secondary display-4\" href=\"#\">RSVP</a>";  
   out += "<a class=\"btn btn-md btn-secondary display-4\" href=\"#\">Learn More</a>";
   out += "</div></div></div>";
   return out;
}

function generateCardsHTML(events_arr)
{
    let EventsHTML = "";
    for (let i=0; i<events_arr.length; i++)
    {
        EventsHTML += generateCard(events_arr[i]);
    }
    return EventsHTML;
}