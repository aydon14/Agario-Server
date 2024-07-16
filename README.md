## Readme Updated 7/15/24

I'm going to keep things short because you only downloaded this to play it. This is a fork of Ardaninho's agario.fun server.
https://github.com/Ardaninho/ArdaninhoAgarServer/
I have been really interested in Agario private servers (yes, I'm stuck in 2015), and found this working server for agario.fun.
I took this as an opportunity to learn more about networking protocols and JavaScript, and thought it would be a fun project.
Now for the non-boring stuff! P.S. Please read the Installation!!!

# Changes Made

- Updated the config, as many options didn't work/weren't implemented.
- Added server color options! (Code borrowed from agarian-2/MultiOgar)
- Added saved configs, to save you some time making your own.
- Added 'ini' support, to make it easier for you to edit the config.
- Added Multiplayer Support! (This was my main goal with the project)
- Organized folders and removed unneeded code/modules.

# Goals for the future

- Increase framerate cap to provide smoother graphics and experience.
- Add more config options to provide more control over your server.

# Single player Installation

1. Download the main code from GitHub.
2. Extract into separate folder.
3. Install node.js: 'https://nodejs.org/'
4. Run './src/Install Dependencies.bat'
5. Paste any config file from './Saved Configs' into './src/' folder AND rename file to 'config.ini' (If not done, the server will build a plain config.ini automatically)
5. Run './src/Start.bat'
6. Connect via 'https://agario.fun/?ip=127.0.0.1:<serverPort>' or 'https://agario.fun/?ip=localhost:<serverPort>'
7. Congrats, your server works!

# Multiplayer Installation

1. Port forward your PC. This can be done by accessing your router (Usually via '192.168.1.1' in your browser) and allowing port forwarding to the ports you have your server set to. Tutorials are found online.
2. Connect to your server via your public IP (can be found at 'https://www.whatismyip.com/') using https://agario.fun/?ip=<yourPublicIP>:<serverPort>. 
3. If this fails, then you may have to change security settings in your browser. Instructions below:

Firefox:
1. Go to 'about:config' in the URL and search 'network.websocket.allowInsecureFromHTTPS' and set to True
2. Go to 'about:preferences#privacy' and disable 'Block dangerous and deceptive content'

Google Chrome/Chromium browsers:
1. In your browser, go to 'agario.fun', and click the lock icon in the URL, then click on 'Site settings'
2. Under 'Permissions', set 'Insecure content' to Allow

NOTE:
These settings allow insecure traffic (HTTP, like your server) over secure sites (HTTPS, like agario.fun).
They could compromise browser/PC security. Make sure to revert these changes when the server isn't in use. 
If you still can't connect to the server, check the console (F12 or corresponding key) and review other errors.
