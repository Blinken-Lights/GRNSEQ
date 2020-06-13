# GRNSEQ
Open source MIDI sequencer based on p5.js, WebMidi, and jQuery

**simplest quickstart**

Download this repo and load /index.html in your browser using the file:/// feature. Install a simple MIDI synth such as https://notahat.com/simplesynth/ to hear the MIDI notes. On a Mac you can set up an IAC Driver Bus to connect GRNSEQ with the MIDI synth. 

**overview**

GRNSEQ is a plain-text step sequencer. Text is divided into 'blocks' shown as columns on the screen. Write your melody into the right-hand column of a block. Each line is one 'step'. As the tune plays, 'playheads' move down the left-hand column of the block. As a playhead passes a line written in the right-hand column, the instructions in that line will be actioned.

Each line corresponds to a 1/16th note, relative to the BPM shown in the top right of the screen.

**saving and loading**

GRNSEQ does not save directly to your computer. To save your work, click VIEW TEXT at the bottom left. Copy the text in the popup window and save it to a text file.

To load a file, open it in a text editor, and copy the text. Click LOAD TEXT at the bottom left, paste the text into the popup window, and click LOAD (at the top right of the popup).

**commands**

*
