(function () {
        "use strict";
        var movies = [
            [
              "Neon Meridian",
              2025,
              "Sci-Fi",
              8.4,
              "A cartographer discovers a city that redraws itself every midnight.",
              "#ef4444",
              "#312e81",
            ],
            [
              "Paper Moons",
              2023,
              "Drama",
              7.8,
              "Two siblings rebuild their bond through a box of unfinished letters.",
              "#7c3aed",
              "#1e3a8a",
            ],
            [
              "After the Signal",
              2024,
              "Thriller",
              8.1,
              "A radio host receives tomorrow's emergency broadcasts one day early.",
              "#991b1b",
              "#172554",
            ],
            [
              "The Last Monsoon",
              2022,
              "Drama",
              7.6,
              "A photographer returns home before the rain changes everything.",
              "#0369a1",
              "#4c1d95",
            ],
            [
              "Orbit of Us",
              2025,
              "Romance",
              7.9,
              "Two engineers on opposite stations share one impossible rescue path.",
              "#be185d",
              "#4338ca",
            ],
            [
              "Static Garden",
              2021,
              "Mystery",
              7.4,
              "An abandoned greenhouse broadcasts voices from its missing caretaker.",
              "#065f46",
              "#4c1d95",
            ],
            [
              "Midnight Courier",
              2024,
              "Action",
              8.0,
              "One rider, one package and ninety minutes before the city locks down.",
              "#b91c1c",
              "#111827",
            ],
            [
              "Blue Hour Cafe",
              2020,
              "Romance",
              7.5,
              "A late-night cafe serves everyone except the person who owns it.",
              "#1d4ed8",
              "#581c87",
            ],
            [
              "Glass District",
              2023,
              "Crime",
              8.2,
              "A forensic architect finds a murder hidden inside a building plan.",
              "#374151",
              "#7f1d1d",
            ],
            [
              "Silent Frequency",
              2022,
              "Sci-Fi",
              7.7,
              "A deaf astronomer detects a pattern no microphone can hear.",
              "#0e7490",
              "#312e81",
            ],
            [
              "Fireline 47",
              2021,
              "Action",
              7.3,
              "A wildfire crew crosses a forbidden ridge to save a forgotten town.",
              "#c2410c",
              "#7f1d1d",
            ],
            [
              "The Memory Index",
              2025,
              "Mystery",
              8.5,
              "A librarian discovers books that remember their previous readers.",
              "#6d28d9",
              "#0f766e",
            ],
            [
              "Second Sunrise",
              2020,
              "Adventure",
              7.6,
              "Five students race the dawn across a chain of floating islands.",
              "#f59e0b",
              "#7c3aed",
            ],
            [
              "Small Revolutions",
              2024,
              "Comedy",
              7.2,
              "A quiet apartment vote becomes the strangest campaign in the city.",
              "#db2777",
              "#1d4ed8",
            ],
            [
              "Red Thread",
              2023,
              "Thriller",
              8.0,
              "A tailor follows a thread that appears at every unsolved crime.",
              "#dc2626",
              "#312e81",
            ],
            [
              "Cloud Atlas Hotel",
              2021,
              "Fantasy",
              7.8,
              "Guests wake on a different floor of reality every morning.",
              "#0284c7",
              "#6d28d9",
            ],
          ].map(function (x, i) {
            return {
              id: i,
              title: x[0],
              year: x[1],
              genre: x[2],
              rating: x[3],
              description: x[4],
              c1: x[5],
              c2: x[6],
            };
          }),
          saved = [];
        try {
          saved = JSON.parse(localStorage.getItem("framehunt:watch") || "[]");
        } catch (x) {}
        var $ = function (x) {
            return document.getElementById(x);
          },
          watchOnly = false,
          lastFocus;
        function options() {
          Array.from(
            new Set(
              movies.map(function (x) {
                return x.genre;
              }),
            ),
          )
            .sort()
            .forEach(function (v) {
              $("genre").insertAdjacentHTML(
                "beforeend",
                "<option>" + v + "</option>",
              );
            });
          Array.from(
            new Set(
              movies.map(function (x) {
                return x.year;
              }),
            ),
          )
            .sort()
            .reverse()
            .forEach(function (v) {
              $("year").insertAdjacentHTML(
                "beforeend",
                "<option>" + v + "</option>",
              );
            });
        }
        function toggle(id, ev) {
          if (ev) ev.stopPropagation();
          saved = saved.includes(id)
            ? saved.filter(function (x) {
                return x !== id;
              })
            : saved.concat(id);
          localStorage.setItem("framehunt:watch", JSON.stringify(saved));
          draw();
        }
        function draw() {
          var q = $("search").value.toLowerCase(),
            genre = $("genre").value,
            year = $("year").value,
            list = movies.filter(function (x) {
              return (
                (!q ||
                  (x.title + " " + x.description).toLowerCase().includes(q)) &&
                (genre === "all" || x.genre === genre) &&
                (year === "all" || String(x.year) === year) &&
                (!watchOnly || saved.includes(x.id))
              );
            });
          $("resultCount").textContent =
            list.length + " title" + (list.length === 1 ? "" : "s");
          $("watchCount").textContent = saved.length + " in watchlist";
          $("watchOnly").textContent =
            "Watchlist: " + (watchOnly ? "On" : "Off");
          $("grid").innerHTML = list.length
            ? ""
            : '<p class="empty">No matching titles. Clear a filter and try again.</p>';
          list.forEach(function (x) {
            var card = document.createElement("article");
            card.className = "movie";
            card.tabIndex = 0;
            card.innerHTML =
              '<div class="poster" style="--c1:' +
              x.c1 +
              ";--c2:" +
              x.c2 +
              '"><b>' +
              x.title +
              '</b></div><div class="movie-body"><h2>' +
              x.title +
              "</h2><p>" +
              x.year +
              " · " +
              x.genre +
              '</p><div class="card-foot"><span class="rating">★ ' +
              x.rating +
              '</span><button class="heart" aria-label="Toggle watchlist">' +
              (saved.includes(x.id) ? "♥" : "♡") +
              "</button></div></div>";
            card.onclick = function () {
              open(x, card);
            };
            card.onkeydown = function (e) {
              if (e.key === "Enter") open(x, card);
            };
            card.querySelector("button").onclick = function (e) {
              toggle(x.id, e);
            };
            $("grid").appendChild(card);
          });
        }
        function open(x, from) {
          lastFocus = from;
          $("detailTitle").textContent = x.title;
          $("description").textContent = x.description;
          $("detailArt").style.setProperty("--c1", x.c1);
          $("detailArt").style.setProperty("--c2", x.c2);
          $("tags").innerHTML =
            "<span>" +
            x.year +
            "</span><span>" +
            x.genre +
            "</span><span>★ " +
            x.rating +
            "</span><span>Sample title</span>";
          $("trailerLink").href =
            "https://www.youtube.com/results?search_query=" +
            encodeURIComponent(x.title + " official trailer");
          $("discoverLink").href =
            "https://www.justwatch.com/in/search?q=" + encodeURIComponent(x.title);
          $("modal").hidden = false;
          $("close").focus();
        }
        function close() {
          $("modal").hidden = true;
          if (lastFocus) lastFocus.focus();
        }
        ["search", "genre", "year"].forEach(function (id) {
          $(id).oninput = draw;
        });
        $("watchOnly").onclick = function () {
          watchOnly = !watchOnly;
          draw();
        };
        $("close").onclick = close;
        $("modal").onclick = function (e) {
          if (e.target === $("modal")) close();
        };
        document.onkeydown = function (e) {
          if (e.key === "Escape" && !$("modal").hidden) close();
        };
        options();
        draw();
      })();

(function () {
        "use strict";
        var rows = [
          ["Dune: Part Two",2024,"Sci-Fi","Hollywood",["Netflix","Prime Video"],8.5,"Paul Atreides unites with Chani and the Fremen while seeking justice.","#c2410c","#1e293b"],
          ["Oppenheimer",2023,"Drama","Hollywood",["Prime Video"],8.6,"The story of the physicist who led the Manhattan Project.","#b91c1c","#111827"],
          ["Spider-Man: Across the Spider-Verse",2023,"Animation","Hollywood",["Netflix","Prime Video"],8.6,"Miles Morales travels through a spectacular multiverse.","#e11d48","#312e81"],
          ["The Batman",2022,"Crime","Hollywood",["Prime Video"],7.8,"Batman follows a trail of corruption through Gotham City.","#111827","#7f1d1d"],
          ["Top Gun: Maverick",2022,"Action","Hollywood",["Prime Video"],8.2,"Maverick returns to train an elite group of naval aviators.","#0369a1","#991b1b"],
          ["Interstellar",2014,"Sci-Fi","Hollywood",["Netflix","Prime Video"],8.7,"Explorers travel through a wormhole to search for humanity's future.","#1d4ed8","#111827"],
          ["Everything Everywhere All at Once",2022,"Fantasy","Hollywood",["Prime Video"],7.8,"An ordinary woman is swept into a wild multiverse adventure.","#db2777","#1d4ed8"],
          ["Knives Out",2019,"Mystery","Hollywood",["Netflix"],7.9,"A detective investigates a deeply dysfunctional family.","#f59e0b","#7f1d1d"],
          ["The Social Network",2010,"Drama","Hollywood",["Netflix"],7.8,"A sharp chronicle of ambition, friendship and a technology empire.","#2563eb","#111827"],
          ["Mad Max: Fury Road",2015,"Action","Hollywood",["Prime Video"],8.1,"Rebels race across a ruined wasteland in a roaring war rig.","#f97316","#7f1d1d"],
          ["12th Fail",2023,"Drama","Bollywood",["JioHotstar"],9.0,"A determined student restarts his journey toward public service.","#f59e0b","#7c2d12"],
          ["Jawan",2023,"Action","Bollywood",["Netflix"],7.0,"A driven vigilante confronts corruption through a daring plan.","#dc2626","#111827"],
          ["Animal",2023,"Action","Bollywood",["Netflix"],6.1,"A volatile father-son relationship spirals into violence.","#991b1b","#030712"],
          ["Pathaan",2023,"Action","Bollywood",["Prime Video"],5.9,"An exiled field agent returns to stop a global threat.","#0ea5e9","#7f1d1d"],
          ["Laapataa Ladies",2024,"Comedy","Bollywood",["Netflix"],8.4,"Two newlywed brides are accidentally exchanged during a train journey.","#ec4899","#0f766e"],
          ["Rocky Aur Rani Kii Prem Kahaani",2023,"Romance","Bollywood",["Prime Video"],6.5,"A couple swaps homes to win over their very different families.","#db2777","#7c3aed"],
          ["Brahmāstra: Part One – Shiva",2022,"Fantasy","Bollywood",["JioHotstar"],5.5,"A young man discovers his connection to a powerful celestial weapon.","#f97316","#4338ca"],
          ["Dangal",2016,"Drama","Bollywood",["Netflix","Prime Video"],8.3,"A former wrestler trains his daughters to compete for India.","#16a34a","#1e3a8a"],
          ["Andhadhun",2018,"Thriller","Bollywood",["Netflix"],8.2,"A pianist becomes entangled in a crime he may or may not have witnessed.","#6d28d9","#111827"],
          ["Zindagi Na Milegi Dobara",2011,"Adventure","Bollywood",["Netflix","Prime Video"],8.2,"Three friends rediscover themselves during a road trip across Spain.","#0ea5e9","#7c3aed"],
          ["RRR",2022,"Action","South Indian",["Netflix","JioHotstar"],7.8,"Two revolutionaries form an unforgettable friendship under colonial rule.","#dc2626","#1d4ed8"],
          ["Kantara",2022,"Thriller","South Indian",["Prime Video"],8.2,"Tradition, nature and rebellion collide in a coastal village.","#b45309","#14532d"],
          ["KGF: Chapter 2",2022,"Action","South Indian",["Prime Video"],8.2,"Rocky expands his empire while facing enemies from every side.","#a16207","#111827"],
          ["Vikram",2022,"Action","South Indian",["JioHotstar"],8.3,"A covert investigator follows a trail of masked killers.","#be123c","#111827"],
          ["Jailer",2023,"Action","South Indian",["Prime Video"],7.1,"A retired jailer hunts the gang threatening his family.","#f59e0b","#334155"],
          ["Leo",2023,"Action","South Indian",["Netflix"],7.2,"A café owner is forced to confront questions about his past.","#dc2626","#1f2937"],
          ["Sita Ramam",2022,"Romance","South Indian",["Prime Video","JioHotstar"],8.6,"An orphaned soldier and a mysterious woman connect through letters.","#ec4899","#1d4ed8"],
          ["777 Charlie",2022,"Adventure","South Indian",["Prime Video"],8.7,"A lonely man's life changes when a spirited dog adopts him.","#f59e0b","#0f766e"],
          ["Hi Nanna",2023,"Drama","South Indian",["Netflix"],8.2,"A father and daughter meet a woman who changes their unfinished story.","#8b5cf6","#0e7490"],
          ["Premalu",2024,"Romance","South Indian",["JioHotstar"],7.8,"A young graduate finds friendship and love in Hyderabad.","#db2777","#4338ca"],
          ["2018",2023,"Drama","South Indian",["SonyLIV"],8.3,"Ordinary people show extraordinary courage during Kerala's floods.","#0284c7","#134e4a"],
          ["Drishyam 2",2021,"Thriller","South Indian",["Prime Video"],8.4,"A family faces the consequences of a secret buried years ago.","#475569","#7f1d1d"],
          ["Maharaja",2024,"Thriller","South Indian",["Netflix"],8.5,"A barber's cryptic police complaint hides a devastating search.","#7f1d1d","#111827"],
          ["Baahubali 2: The Conclusion",2017,"Fantasy","South Indian",["Netflix","JioHotstar"],8.2,"A warrior discovers the truth behind his royal legacy.","#b45309","#1e3a8a"],
          ["Super Deluxe",2019,"Drama","South Indian",["Netflix"],8.3,"Several lives intersect during one unpredictable day in Chennai.","#ec4899","#0f766e"],
          ["96",2018,"Romance","South Indian",["Prime Video"],8.5,"Two former classmates meet again after twenty-two years.","#7c3aed","#1e3a8a"]
        ];
        var movies = rows.map(function (x, id) { return {id:id,title:x[0],year:x[1],genre:x[2],region:x[3],providers:x[4],rating:x[5],description:x[6],c1:x[7],c2:x[8]}; });
        var saved = JSON.parse(localStorage.getItem("framehunt:watch:real") || "[]"), watchOnly = false, current = null;
        var $ = function (id) { return document.getElementById(id); };
        function safe(value) { return String(value).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }
        function officialSearch(provider,title) {
          var q=encodeURIComponent(title);
          if(provider==="Netflix") return "https://www.netflix.com/search?q="+q;
          if(provider==="Prime Video") return "https://www.primevideo.com/search/ref=atv_nb_sr?phrase="+q;
          if(provider==="JioHotstar") return "https://www.jiohotstar.com/search?q="+q;
          if(provider==="SonyLIV") return "https://www.sonyliv.com/search?q="+q;
          return "https://www.justwatch.com/in/search?q="+q;
        }
        function setupFilters(){
          $("genre").innerHTML='<option value="all">All genres</option>' + Array.from(new Set(movies.map(function(m){return m.genre;}))).sort().map(function(v){return '<option>'+safe(v)+'</option>';}).join("");
          $("year").innerHTML='<option value="all">All years</option>' + Array.from(new Set(movies.map(function(m){return m.year;}))).sort().reverse().map(function(v){return '<option>'+v+'</option>';}).join("");
        }
        function toggle(id,event){event.stopPropagation();saved=saved.includes(id)?saved.filter(function(v){return v!==id;}):saved.concat(id);localStorage.setItem("framehunt:watch:real",JSON.stringify(saved));draw();}
        function openMovie(movie,from){
          current=from; $("detailTitle").textContent=movie.title; $("description").textContent=movie.description;
          $("detailArt").style.setProperty("--c1",movie.c1); $("detailArt").style.setProperty("--c2",movie.c2);
          $("tags").innerHTML=[movie.year,movie.genre,movie.region,"★ "+movie.rating].map(function(v){return "<span>"+safe(v)+"</span>";}).join("");
          $("trailerLink").href="https://www.youtube.com/results?search_query="+encodeURIComponent(movie.title+" official trailer");
          $("discoverLink").href="https://www.justwatch.com/in/search?q="+encodeURIComponent(movie.title);
          $("providerLinks").innerHTML=movie.providers.map(function(provider){return '<a target="_blank" rel="noreferrer" href="'+officialSearch(provider,movie.title)+'" style="padding:9px 12px;border:1px solid #ffffff26;border-radius:10px;color:#cfe1ff;text-decoration:none">Search '+safe(provider)+'</a>';}).join("");
          $("modal").hidden=false; $("close").focus();
        }
        function draw(){
          var q=$("search").value.trim().toLowerCase(),genre=$("genre").value,year=$("year").value,region=$("region").value,platform=$("platform").value;
          var list=movies.filter(function(m){return (!q||(m.title+" "+m.description+" "+m.region).toLowerCase().includes(q))&&(genre==="all"||m.genre===genre)&&(year==="all"||String(m.year)===year)&&(region==="all"||m.region===region)&&(platform==="all"||m.providers.includes(platform))&&(!watchOnly||saved.includes(m.id));});
          $("resultCount").textContent=list.length+" of "+movies.length+" titles"; $("watchCount").textContent=saved.length+" in watchlist"; $("watchOnly").textContent="Watchlist: "+(watchOnly?"On":"Off"); $("grid").innerHTML="";
          if(!list.length){$("grid").innerHTML='<p class="empty">No matching title. Try another filter or search.</p>';return;}
          list.forEach(function(m){var card=document.createElement("article");card.className="movie";card.tabIndex=0;card.innerHTML='<div class="poster" style="--c1:'+m.c1+';--c2:'+m.c2+'"><span style="position:absolute;top:14px;left:14px;padding:5px 8px;border-radius:99px;background:#050307aa;font-size:9px">'+safe(m.region)+'</span><b>'+safe(m.title)+'</b></div><div class="movie-body"><h2>'+safe(m.title)+'</h2><p>'+m.year+' · '+safe(m.genre)+'</p><p style="margin-top:7px;color:#c4b5fd">'+m.providers.map(safe).join(" · ")+'</p><div class="card-foot"><span class="rating">★ '+m.rating+'</span><button class="heart" aria-label="Toggle watchlist">'+(saved.includes(m.id)?"♥":"♡")+'</button></div></div>';card.onclick=function(){openMovie(m,card);};card.onkeydown=function(e){if(e.key==="Enter")openMovie(m,card);};card.querySelector("button").onclick=function(e){toggle(m.id,e);};$("grid").appendChild(card);});
        }
        setupFilters(); ["search","genre","year","region","platform"].forEach(function(id){$(id).oninput=draw;}); $("watchOnly").onclick=function(){watchOnly=!watchOnly;draw();}; $("close").onclick=function(){$("modal").hidden=true;if(current)current.focus();}; $("modal").onclick=function(e){if(e.target===$("modal"))$("close").click();}; draw();
      })();
