ABOUT PROJECT 
This is full stack youtube clone 
user can play video is 240 360 480 720 1080 p 
include features like Adaptive bitratr streming ,real time channel analytics,real time events and notification and much more 

TECHNOLOGIES 
REACT,NODE,EXPRESS,CHARTJS,SOCKETIO,FFMPEG,MONGODB,FIREBASE

RUN THIS PROJECT
to run this project open cmd and navigate to project directory and write these commands one by one 
STEP ONE INSTALL ALL PACKAGES FOR FRONTEND AND BACKEND 
cd frontend 
npm install 
now open one more terminal and write 
cd backend 
npm install 

Step TWO 
now download and install ffmpeg for video processing 
https://github.com/BtbN/FFmpeg-Builds/releases
click on ffmpeg-master-latest-win64-gpl.zip after succesfully install 

Step 3
now Set up path in your application for ffmpeg 
Open project in VS CODE and go to backend and go to controller 
in upload.js you can see path for ffmpeg such as 
ffmpeg.setFfmpegPath("C:\\Users\\yasin\\ffmpeg\\bin\\ffmpeg.exe");
instead this path C:\\Users\\yasin\\ffmpeg\\bin\\ffmpeg.exe write your path 

Step 4 ALL DONE now run projects 
 for frontend 
 npm start
and for backend 
npx nodemon index.js 







https://github.com/user-attachments/assets/0faf26c4-9734-41a3-bc2f-203621b64c40





