# GRNSEQ
Open source MIDI sequencer based on p5.js, WebMidi, and jQuery

**simplest quickstart**

Download this repo and load /index.html in your browser using the file:/// feature. Install a simple MIDI synth such as https://notahat.com/simplesynth/ to hear the MIDI notes. On a Mac you can set up an IAC Driver Bus to connect GRNSEQ with the MIDI synth. 

**overview**

GRNSEQ is a plain-text step sequencer. Text is divided into 'blocks' shown as columns on the screen. Write your melody into the right-hand column of a block. Each line is one 'step'. As the tune plays, 'playheads' move down the left-hand column of the block. As a playhead passes a line written in the right-hand column, the instructions in that line will be actioned.

Each line corresponds to a 1/16th note, relative to the BPM shown in the top right of the screen.

**choosing a MIDI output**

If your system has no available MIDI outputs, GRNSEQ will alert you and will not run. Install a MIDI output device then reload GRNSEQ.

GRNSEQ will automatically choose the first available MIDI output. To change MIDI output, click the text showing the name of the currently selected MIDI output, at the top left of centre of the screen.

**saving and loading**

GRNSEQ does not save directly to your computer. To save your work, click VIEW TEXT at the bottom left. Copy the text in the popup window and save it to a text file.

To load a file, open it in a text editor, and copy the text. Click LOAD TEXT at the bottom left, paste the text into the popup window, and click LOAD (at the top right of the popup).

**keyboard controls**

* ALT - play / pause the melody

* ESC - reset the melody and delete all playheads

**commands**

*Commands make up your melody. They can be typed in to the right hand column of each block. Each line is a new step in the melody.*

*playhead commands*

* \> Creates a playhead at this location, when you press ALT to play the melody. If you've previously paused the melody, a new playhead will *not* be created - if you want to start from scratch again, press ESC to reset and delete all current playheads. Then press ALT.

* ^ Tells a playhead to return to the last > or < symbol that it passed.

* < A flag that doesn't create a playhead, but serves as a return point for a playhead (see ^ above)

*note commands*

Notes can be created in several different ways. EG:

* A#4 - where A# is the note, and 4 is the octave

* M35 - where 35 is the MIDI note number

* I0 - where 0 is relative the the block 'root note' shown in the green bar at the top of each block. These types of notes are also quantised to the chosen scale.
* * I{1,4,7} - each time a specific playhead passes this note, a different note will be voiced, iterating through 1, 4, then 7.

* R[35,36,37] - each time a playhead passes this note, a note will be played at random out of the set 35, 36, and 37.

All types of note support optional modifiers. You don't have to use all of them, but they must be used in this specific order:

* C4L5V7H11
would correspond to: note C4, Length 5/16th, Velocity 7 (out of 9), H=MIDI cHannel 11 (overrides 'block' channel)

The digits in any of these modifiers can be replaced with R for 'very random' or r for 'a bit random'.

*misc commands*

* S4 - 'stutter' or 'ratchet': replay the entire line for each of the next 4 1/16th note steps). Also use R or r in place of the digits.

* T120 - set the 'global' tempo to 120 BPM. Also use R or r in place of the digits.

* Z2 - set the 'global' divisor to 2. Also use R or r in place of the digits. This causes the whole melody to run at a division of the global tempo, which is good for creating pleasent sounding changes of pace.

*'block' commands*

These commands set parameters on other blocks, which is great for creating modulation on a melodies running in those other blocks.

* @2:r\*36 - would change the 'root note' of block 2 to 36. That would affect any notes defined using 'I' (see *note commands*)

* @2:r+3 - would add 3 to the 'root note' of block 2. @2:r-3 would subtract 3.

* @2:(play|pause|bplay|reset|preset|mute|unmute|solo|unsolo) - choose any one of the keywords in the brackets. play/pause/mute/unmute are self explanatory. bplay: start playing the block at the start of the next 64x1/16th note bar. reset: send all playheads in the block back to the last > or < that they passed. preset: pause and reset. solo: mute all *other* blocks. unsolo: unmute all blocks.

* @2:ch10 - change block channel (and channels of all playheads in the block) to play on MIDI channel 10

* @2:|2 - change divisor of the block (and all playheads within it) to 2 - so the playheads will move at 1/2 the global tempo


*blocks*

Blocks are self-contained loops of text, with a default MIDI channel, root note and divisor (a division of the global tempo). New playheads created within a block inherit the block's MIDI channel and divisor. Notes played using 'I' are relative to the block's root note and are quantised to the global scale. Some commands can change a playheads' characteristics, but every time a block is modified, its playheads will re-inherit the block's MIDI channel and divisor.

*block buttons - within green bar at the top of each block*

Click on the channel, root note or divisor shown in the green top bar of a block, to change those settings.

Click '+' to create a new block next to the one you clicked. '-' will delete the block.

S solos the block.. click >S to un-solo it.

M! mutes the block.. M> unmutes it.

\> pauses the block.. ! starts it playing again

B! will start the block playing at the start of the next 64x1/16th note bar. It will change to B>, then toggle itself off once it's reached that new bar. You can also turn it back off manually, before that point.


*changing global parameters*

'Global' parameters apply to the whole melody. They are shown at the top right of the screen. Click on either Scale, Key or Tempo, to launch a popup allowing you to change all of them.

Scale and Key only apply to 'I' notes.

*changing the number of rows of blocks*

Click the little number to the left of PAUSED / PLAYING to change the number of rows shown on screen. The default is 1 row, but depending on number of blocks used / your screen dimensions, you can choose to show up to 8 rows.
