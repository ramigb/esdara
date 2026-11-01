Esdara (The Independent Arabic Music Directory): 

Is a music directory for new Arabic music releases. It features Arabic artists from around the region and their latest releases. 

Features: 
- Everything is a file. everything is an .md file with yaml front matter
- Each artist and his albums and songs are contained in a directory of their own. Each directory is identified by index.md file that contains meta and visible information about the artist or their album. 
- A local syncer creates highly customizable SQLite index from the files for search, pagination and other operations. SQLite points to files to stay lightweight and don't store the texts there <LLM can determine best solution> 
- On the web the user have a SQLite for web (website works without it if browser does not support but without indexing or search functionality) <LLM can determine best solution> 
- Artists are asked to submit a GitHub PR to add their latest songs, modify a song, or update their pages.
- Songs are linkes to YouTube and Spotify
- Site is opensource, so is the content with copyrights of the songs to their respective owners we just index songs and artists
- Site works flawlessly on mobile devices
- Site is multilingual and RTL out of the box. Arabic and English are the first two official languages



Home page features: 
- Similar to reddit and ynews the home page acts as an aggregator to latest songs
- Filters can be based on artist country, genre, music service (youtube, spotify, etc) 

