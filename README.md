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

*Commands make up your melody. They can be typed in to the right hand column of each block. Each line is a new step in the melody*

*playhead commands*

* \> Creates a playhead at this location, when you press ALT to play the melody. If you've previously paused the melody, a new playhead will *not* be created - if you want to start from scratch again, press ESC to reset and delete all current playheads. Then press ALT.

* ^ Tells a playhead to return to the last > or < symbol that it passed.

* < A flag that doesn't create a playhead, but serves as a return point for a playhead (see ^ above)

