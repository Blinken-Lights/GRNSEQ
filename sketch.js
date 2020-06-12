let midiOutput;

let playing = false;
let was_reset = true;

let rows = 1;

// key and scale are the only global properties
let key = "C";
let key_index = 3;
let scale = "Chromatic";
let scale_notes = []; // load scale notes into this array, on change
let global_beats = 0;
let global_bar_beats = 0;
let gd_pos = 0; // gd = global default
let gd_channel = 1;
let gd_octave = 4;
let gd_length = 1;
let gd_velocity = 5;
let gd_bpm = 60.0;
let gd_divisor = 1;
let gd_root_note = 36;
let gd_default_note = 36;
let global_bpm = gd_bpm;
let global_divisor = gd_divisor;
let global_nextNote = 0.0;
let global_interval = 0;
let global_beat_indicator = false;
let playhead_limit = 128;
let note_letters = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
let scales = [{
    'label': "Chromatic",
    'notes': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127]
  },
  {
    'label': "Major",
    'notes': [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24, 26, 28, 29, 31, 33, 35, 36, 38, 40, 41, 43, 45, 47, 48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84, 86, 88, 89, 91, 93, 95, 96, 98, 100, 101, 103, 105, 107, 108, 110, 112, 113, 115, 117, 119, 120, 122, 124, 125, 127]
  },
  {
    'label': "Minor",
    'notes': [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 22, 24, 26, 27, 29, 31, 32, 34, 36, 38, 39, 41, 43, 44, 46, 48, 50, 51, 53, 55, 56, 58, 60, 62, 63, 65, 67, 68, 70, 72, 74, 75, 77, 79, 80, 82, 84, 86, 87, 89, 91, 92, 94, 96, 98, 99, 101, 103, 104, 106, 108, 110, 111, 113, 115, 116, 118, 120, 122, 123, 125, 127]
  },
  {
    'label': "Harmonic Minor",
    'notes': [0, 2, 3, 5, 7, 8, 11, 12, 14, 15, 17, 19, 20, 23, 24, 26, 27, 29, 31, 32, 35, 36, 38, 39, 41, 43, 44, 47, 48, 50, 51, 53, 55, 56, 59, 60, 62, 63, 65, 67, 68, 71, 72, 74, 75, 77, 79, 80, 83, 84, 86, 87, 89, 91, 92, 95, 96, 98, 99, 101, 103, 104, 107, 108, 110, 111, 113, 115, 116, 119, 120, 122, 123, 125, 127]
  },
  {
    'label': "Dorian",
    'notes': [0, 2, 3, 5, 7, 9, 10, 12, 14, 15, 17, 19, 21, 22, 24, 26, 27, 29, 31, 33, 34, 36, 38, 39, 41, 43, 45, 46, 48, 50, 51, 53, 55, 57, 58, 60, 62, 63, 65, 67, 69, 70, 72, 74, 75, 77, 79, 81, 82, 84, 86, 87, 89, 91, 93, 94, 96, 98, 99, 101, 103, 105, 106, 108, 110, 111, 113, 115, 117, 118, 120, 122, 123, 125, 127]
  },
  {
    'label': "Hirajoshi",
    'notes': [0, 2, 3, 7, 8, 12, 14, 15, 19, 20, 24, 26, 27, 31, 32, 36, 38, 39, 43, 44, 48, 50, 51, 55, 56, 60, 62, 63, 67, 68, 72, 74, 75, 79, 80, 84, 86, 87, 91, 92, 96, 98, 99, 103, 104, 108, 110, 111, 115, 116, 120, 122, 123, 127]
  },
  {
    'label': "Chinese",
    'notes': [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36, 38, 40, 43, 45, 48, 50, 52, 55, 57, 60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96, 98, 100, 103, 105, 108, 110, 112, 115, 117, 120, 122, 124, 127]
  }
];

let beat_indicator = false;
let whole_note_indicator = false;
let whole_note_count = 0;

// quantise all 'Q' notes to the *nearest* note in the key/scale
// all other properties are held in each playhead
let playheads = [
  /*{ //example playhead object
    pos:          0,
    default_channel:   0,
    default_octave:    4,
    default_length:    1,
    default_velocity:  5,
    bpm:               30.0,
    divisor:           1,
    interval:          // calculated whenever bpm or divisor change
    nextNote:          // calculated on each beat
    previous_line:     // to keep track of the highlighting to remove
    root_note:         48,
    default_note:      0 // relative to root note
  }*/
];
let blocks = [];
let block_ids = [];
let playhead_div = [];
let next_block_id = 1;

let playhead_id_number = 0;

function setup() {
  noCanvas();

  global_nextNote = WebMidi.time + 1000;

  global_interval = calculate_interval(global_bpm, global_divisor);

  load_scale_notes();

  beat_indicator = document.getElementById("b");
  whole_note_indicator = document.getElementById("s");

  document.getElementById("global-scale").innerHTML = scale;
  document.getElementById("global-key").innerHTML = key;

  poll();

  create_block();
  create_block();
  create_block();

  // for testing - remove this
  //create_playhead({'pos':0});
  //create_playhead({'pos':7});
  //create_playhead({'pos':15});
}

function poll() {

  if (!playing) {
    setTimeout(poll, 1);
    return;
  }

  if (midiOutput) {

    var lines = [];
    var started = WebMidi.time;
    var global_beat_done = false;

    if (global_nextNote - WebMidi.time <= (global_interval / 2)) {
      if (global_beats % 8 == 0) {
        global_beat_indicator = !global_beat_indicator;
      }
      beat_indicator.innerHTML = global_beat_indicator ? '|' : 'O';
      whole_note_count = ceil(global_bar_beats / 16);
      whole_note_indicator.innerHTML = whole_note_count;

      var is_new_bar = ((global_bar_beats % 64) == 0);
      if (is_new_bar) {
        for (var b in blocks) {
          if (blocks[b].bar_play) {
            for (var p in playheads) {
              if (playheads[p].block == blocks[b].block_id) {
                playheads[p].play = true;
              }
            }

            blocks[b].bar_play = false;
            blocks[b].play = true;
            $('#block_' + blocks[b].block_id + ' .block-bar-toggle-play').text('B!');
            $('#block_' + blocks[b].block_id + ' .block-toggle-play').text('>');
          }
        }
      }

      global_beat_done = true;

      $('.block').each(function() {
        var block_id = parseInt($(this).attr('id').split('_')[1]);
        if (!block_ids.includes(block_id)) {
          block_ids.push(block_id);
        }

        //create recurring playheads
        if (typeof lines[block_id] === 'undefined') {
          lines[block_id] = document.getElementById("editable" + block_id).value.split("\n");
          playhead_div[block_id] = [];
          for (var l in lines[block_id]) {
            playhead_div[block_id][l] = '<br/>';

            if (lines[block_id][l].indexOf('>:') > -1) {
              create_playhead_from_line(block_id, l, lines[block_id][l]);
            }
          }
        }
      });

      global_beats++;
      global_bar_beats++;
      if (global_bar_beats >= 64) {
        global_bar_beats = 0;
      }
      global_nextNote += global_interval;
    }

    for (var p in playheads) {

      if (playheads[p].nextNote - WebMidi.time <= (playheads[p].interval / 2)) {
        if (!playheads[p].play) {
          playheads[p].nextNote += playheads[p].interval;
          continue;
        }

        var block_id = playheads[p].block;

        if (typeof lines[block_id] === 'undefined') {
          lines[block_id] = document.getElementById("editable" + playheads[p].block).value.split("\n");
        }

        if (lines[block_id].length == 0) {
          return;
        } else if (playheads[p].pos >= lines[block_id].length) {
          playheads[p].pos = 0;
        } else if (playheads[p].pos < 0) {
          playheads[p].pos = lines[block_id].length - 1;
        }
        var line_text = lines[block_id][playheads[p].pos].split('#')[0].trim();

        if (line_text.indexOf('>') > -1 || line_text.indexOf('<') > -1) {
          playheads[p].last_creator = playheads[p].pos;
        }

        //var block_controls = line_text.match(/@\d{1,4}:(play|pause|bplay)/gi);
        var block_controls = line_text.match(/@\d{1,4}(:play|:pause|:bplay|:reset|:preset|:mute|:unmute|:solo|:unsolo)?(:ch\d{1,2})?(:r\*\d{1,3})?(:r\+\d{1,3})?(:r-\d{1,3})?(:\|\d{1,3})?/gi);
        for (var c in block_controls) {
          var possible_block_ids = block_controls[c].match(/@\d{1,4}:/gi);
          if (possible_block_ids !== null) {
            var possible_block_id = parseInt(possible_block_ids[0].replace('@', '').replace(':', ''));
            if (possible_block_id > 0) {

              var cbk = false;
              for (var commanded_block_key in blocks) {
                if (blocks[commanded_block_key].block_id == possible_block_id) {
                  cbk = commanded_block_key;
                  break;
                }
              }

              if (cbk !== false) {

                var block_commands = block_controls[c].match(/(play|pause|bplay|reset|preset|mute|unmute|solo|unsolo)/gi);
                if (block_commands !== null) {
                  if (block_commands[0] == 'solo' || block_commands[0] == 'unsolo') {
                    blocks[cbk].solo = (block_commands[0] == 'solo');
                    $('#block_' + possible_block_id + ' .block-toggle-solo').text(blocks[cbk].solo ? '>S' : 'S');
                    for (var tos in blocks) {
                      if (blocks[tos].block_id != possible_block_id) {
                        blocks[tos].solo = (block_commands[0] != 'solo');
                        $('#block_' + blocks[tos].block_id + ' .block-toggle-solo').text(blocks[tos].solo ? '>S' : 'S');
                      }
                    }
                    for (var pl in playheads) {
                      if (playheads[pl].block == possible_block_id) {
                        playheads[pl].muted = false;
                      } else {
                        playheads[pl].muted = blocks[cbk].solo;
                      }
                      $('#block_' + playheads[p].block + ' .block-toggle-mute').text(playheads[p].muted ? 'M>' : 'M!');
                    }
                  } else if (block_commands[0] == 'mute' || block_commands[0] == 'unmute') {
                    blocks[cbk].muted = (block_commands[0] == 'mute');
                    $('#block_' + possible_block_id + ' .block-toggle-mute').text(blocks[cbk].muted ? 'M>' : 'M!');
                    for (var pl in playheads) {
                      if (playheads[pl].block == possible_block_id) {
                        playheads[pl].muted = blocks[cbk].muted;
                      }
                    }
                  } else if (block_commands[0] == 'play') {
                    blocks[cbk].play = true;
                    $('#block_' + possible_block_id + ' .block-toggle-play').text('>');
                    for (var pl in playheads) {
                      if (playheads[pl].block == possible_block_id) {
                        playheads[pl].play = true;
                      }
                    }
                  } else if (block_commands[0] == 'bplay') {
                    blocks[cbk].bar_play = true;
                    $('#block_' + possible_block_id + ' .block-bar-toggle-play').text('B>');
                  } else if (block_commands[0] == 'pause') {
                    blocks[cbk].play = false;
                    $('#block_' + possible_block_id + ' .block-toggle-play').text('!');
                    for (var pl in playheads) {
                      if (playheads[pl].block == possible_block_id) {
                        playheads[pl].play = false;
                      }
                    }
                  } else if (block_commands[0] == 'reset' || block_commands[0] == 'preset') {
                    if (block_commands[0] == 'preset') {
                      blocks[cbk].play = false;
                      $('#block_' + possible_block_id + ' .block-toggle-play').text('!');
                    }

                    for (var pl in playheads) {
                      if (playheads[pl].block == possible_block_id) {
                        playheads[pl].pos = playheads[pl].last_creator - ((playheads[p].direction == 1) ? 1 : 0);
                        if (block_commands[0] == 'preset') {
                          playheads[pl].play = false;
                        }
                      }
                    }
                  }
                }
                var channel_commands = block_controls[c].match(/ch\d{1,2}/gi);
                if (channel_commands !== null) {
                  var pbc = parseInt(channel_commands[0].replace('ch', ''));
                  if (pbc > 0) {
                    blocks[cbk].channel = pbc;
                    $('#block_' + possible_block_id + ' .block-channel').text(pbc);
                    for (var pl in playheads) {
                      if (playheads[pl].block == possible_block_id) {
                        playheads[pl].channel = pbc;
                      }
                    }
                  }
                }
                var root_commands = block_controls[c].match(/r\*\d{1,3}/gi);
                if (root_commands !== null) {
                  var pbr = parseInt(root_commands[0].replace('r*', ''));
                  if (pbr > 0) {
                    blocks[cbk].root_note = pbr;
                    $('#block_' + possible_block_id + ' .block-rootnote').text(pbr);
                    for (var pl in playheads) {
                      if (playheads[pl].block == possible_block_id) {
                        playheads[pl].default_note = pbr;
                      }
                    }
                  }
                }
                var rp_commands = block_controls[c].match(/r\+\d{1,3}/gi);
                if (rp_commands !== null) {
                  var pbp = parseInt(rp_commands[0].replace('r+', ''));
                  if (pbp > 0) {
                    blocks[cbk].root_note += pbp;
                    if (blocks[cbk].root_note > 127) {
                      blocks[cbk].root_note -= 127;
                    }
                    $('#block_' + possible_block_id + ' .block-rootnote').text(blocks[cbk].root_note);
                    for (var pl in playheads) {
                      if (playheads[pl].block == possible_block_id) {
                        playheads[pl].default_note = blocks[cbk].root_note;
                      }
                    }
                  }
                }
                var rm_commands = block_controls[c].match(/r-\d{1,3}/gi);
                if (rm_commands !== null) {
                  var pbm = parseInt(rm_commands[0].replace('r-', ''));
                  if (pbm > 0) {
                    blocks[cbk].root_note -= pbm;
                    if (blocks[cbk].root_note < 0) {
                      blocks[cbk].root_note += 127;
                    }
                    $('#block_' + possible_block_id + ' .block-rootnote').text(blocks[cbk].root_note);
                    for (var pl in playheads) {
                      if (playheads[pl].block == possible_block_id) {
                        playheads[pl].default_note = blocks[cbk].root_note;
                      }
                    }
                  }
                }
                var div_commands = block_controls[c].match(/\|\d{1,3}/gi);
                if (div_commands !== null) {
                  var pbd = parseInt(div_commands[0].replace('|', ''));
                  if (pbd > 0) {
                    blocks[cbk].divisor = pbd;
                    $('#block_' + possible_block_id + ' .block-divisor').text('/' + pbd);
                    for (var pl in playheads) {
                      if (playheads[pl].block == possible_block_id) {
                        playheads[pl].divisor = pbd;
                        playheads[pl].interval = calculate_interval(playheads[pl].bpm, playheads[pl].divisor);
                      }
                    }
                  }
                }

              }
            }
          }
        }

        for (var s in playheads[p].stutters) {
          line_text += " " + playheads[p].stutters[s].line_text;
          playheads[p].stutters[s].repeats--;
          if (playheads[p].stutters[s].repeats == 0) {
            playheads[p].stutters.splice(s, 1);
          }
        }

        var playhead_modulations = line_text.match(/P\d{1,4}:((\d{1,3})|O\+|O-|\+(\d{1,3})?|-(\d{1,3})?|D)/gi);
        if (playhead_modulations !== null) {
          for (var pms in playhead_modulations) {
            var pm_text = playhead_modulations[pms];
            var playhead_numbers = pm_text.match(/P\d{1,4}/gi);
            var playhead_defnotes = pm_text.match(/:\d{1,3}/gi);
            var plus_group = pm_text.match(/\+(\d{1,3})?/gi);
            var minus_group = pm_text.match(/-(\d{1,3})?/gi);

            var plus = 0;
            var minus = 0;
            if (plus_group !== null) {
              plus = parseInt(plus_group[0].replace('+', ''));
              if (isNaN(plus)) {
                plus = 1;
              }
            } else if (minus_group !== null) {
              minus = parseInt(minus_group[0].replace('-', ''));
              if (isNaN(minus)) {
                minus = 1;
              }
            }

            if (playhead_numbers !== null) {
              var playhead_number = parseInt(playhead_numbers[0].replace('P', ''));
              if (typeof playheads[playhead_number] === 'undefined') {
                continue;
              }
              if (playhead_defnotes != null) {
                var playhead_defnote = parseInt(playhead_defnotes[0].replace(':', ''));
                playheads[playhead_number].default_note = playhead_defnote;
              } else if (pm_text.indexOf('D') > -1) {
                //doesn't currently work because
                //it causes array indexes to change
                //during the loop
                //playheads.splice(playhead_number, 1);
                continue;
              } else if (pm_text.indexOf('O+') > -1) {
                playheads[playhead_number].default_note += 12;
              } else if (pm_text.indexOf('O-') > -1) {
                playheads[playhead_number].default_note -= 12;
              } else if (plus > 0) {
                playheads[playhead_number].default_note += plus;
              } else if (minus > 0) {
                playheads[playhead_number].default_note -= minus;
              }
              if (playheads[playhead_number].default_note > 108) {
                playheads[playhead_number].default_note -= 88;
              } else if (playheads[playhead_number].default_note < 21) {
                playheads[playhead_number].default_note += 21;
              }
            }
          }
        }

        //var notes = line_text.match(/[ABCDGEFGMQR](#|b)?(\d{1,3}|R)(L(\d{1,3}|R))?(V([0-9]|R))?(H(\d{1,2}|R))?(S(\d{1,3}|R))?/gi);
        //var notes = line_text.match(/(([ABCDGEFGMIR](#|b)?(\d{1,3}|R))|(R\[([1-9][0-9]*[ ]*,[ ]*)*[1-9][0-9]*\]))(L(\d{1,3}|R))?(V([0-9]|R))?(H(\d{1,2}|R))?(S(\d{1,3}|R))?/gi);
        var notes = line_text.match(/(([ABCDGEFGMIR](#|b)?(\d{1,3}|R))|(R\[([1-9][0-9]*[ ]*,[ ]*)*[1-9][0-9]*\])|(I\{([1-9][0-9]*[ ]*,[ ]*)*[1-9][0-9]*\}))(L(\d{1,3}|R))?(V([0-9]|R))?(H(\d{1,2}|R))?(S(\d{1,3}|R))?/gi);
        var tempos = line_text.match(/T(\d{1,3}|R)/gi);
        var divisors = line_text.match(/\Z(\d{1,3}|R)/gi);
        // modify default length and velocity
        var stutters = line_text.match(/S(\d{1,3}|R)/gi); //should the actual clock be running 4 times faster than a 16th note..? Or each line by default runs for one beat (16 ticks) and modifiers can change that!

        if (tempos !== null) {
          var possible_bpm = tempos[0].replace('T', '');
          if (possible_bpm == 'r') {
            possible_bpm = rand(30, 60);
          } else if (possible_bpm == 'R') {
            possible_bpm = rand(1, 120);
          } else {
            possible_bpm = parseInt(possible_bpm);
          }
          if (possible_bpm > 0) {
            global_bpm = parseInt(possible_bpm);
            global_interval = calculate_interval(global_bpm, global_divisor);
            $('#global-bpm').text(global_bpm);
          }
        }
        if (divisors !== null) {
          var possible_divisor = divisors[0].replace('Z', '');
          if (possible_divisor == 'r') {
            possible_divisor = rand(1, 16);
          } else if (possible_divisor == 'R') {
            possible_divisor = rand(1, 256);
          } else {
            possible_divisor = parseInt(possible_divisor);
          }
          if (possible_divisor >= 1) {
            playheads[p].divisor = possible_divisor;
            playheads[p].interval = calculate_interval(playheads[p].bpm, playheads[p].divisor);
          }
        }
        if (stutters !== null) {
          var possible_stutter_repeats = stutters[0].replace('S', '');
          if (possible_stutter_repeats == 'r') {
            possible_stutter_repeats = rand(1, 4);
          } else if (possible_stutter_repeats == 'R') {
            possible_stutter_repeats = rand(1, 16);
          } else {
            possible_stutter_repeats = parseInt(possible_stutter_repeats);
          }
          if (possible_stutter_repeats >= 1) {
            playheads[p].stutters.push({
              line_text: line_text.replace('S', ' '),
              repeats: possible_stutter_repeats
            });
          }
        }

        for (var j in notes) {
          var note = notes[j].match(/[ABCDGEFGR](#|b)?([0-9]|R)/gi);
          var midi_note = notes[j].match(/M(\d{1,3}|R)/gi);
          var relative_note = notes[j].match(/I(\d{1,3}|R)/gi);
          var relative_note_rotation = notes[j].match(/I\{([1-9][0-9]*[ ]*,[ ]*)*[1-9][0-9]*\}/gi);
          var random_array_note = notes[j].match(/R\[([1-9][0-9]*[ ]*,[ ]*)*[1-9][0-9]*\]/gi);
          if (random_array_note !== null) {
            var possible_random_array_note = random_array_note[0].replace('R', '').replace('[', '').replace(']', '');
            var random_array = possible_random_array_note.split(',');
            if (random_array.length > 0) {
              var random_index = rand(0, random_array.length - 1);
              note = parseInt(random_array[random_index].trim());
            } else {
              continue;
            }
          } else if (midi_note !== null) {
            var possible_midi = midi_note[0].replace('M', '');
            if (possible_midi == 'r') {
              note = rand(21, 108);
            } else if (possible_midi == 'R') {
              note = rand(0, 127);
            } else {
              note = parseInt(possible_midi);
            }
            if (note == 0) {
              note = playheads[p].default_note;
              if (note > 108) {
                note = 108;
              } else if (note < 21) {
                note = 21;
              }
            }
          } else if (relative_note !== null || relative_note_rotation !== null) {
            if (relative_note !== null) {
              var possible_relative = relative_note[0].replace('I', '');
            }
            var rn = 0;
            if (relative_note_rotation !== null) {
              var possible_rotate = relative_note_rotation[0].replace('I', '').replace('{', '').replace('}', '').split(',');
              if (possible_rotate.length > 0) {
                if (typeof playheads[p].rotate_lines[playheads[p].pos] !== 'undefined') {
                  playheads[p].rotate_lines[playheads[p].pos]++;
                  if (playheads[p].rotate_lines[playheads[p].pos] >= possible_rotate.length) {
                    playheads[p].rotate_lines[playheads[p].pos] = 0;
                  }
                } else {
                  playheads[p].rotate_lines[playheads[p].pos] = 0;
                }

                rn = parseInt(possible_rotate[playheads[p].rotate_lines[playheads[p].pos]]);
              }
            } else if (possible_relative == 'r') {
              rn = rand(21, 108);
            } else if (possible_relative == 'R') {
              rn = rand(0, 127);
            } else {
              rn = parseInt(possible_relative);
            }

            var note_within_key = playheads[p].default_note + rn;
            if (note_within_key >= scale_notes.length) {
              note_within_key = scale_notes.length - 1;
            } else if (note_within_key < 0) {
              note_within_key = 0;
            }

            note = (key_index + 9) + scale_notes[note_within_key];
            if (note > 108) {
              note -= 88;
            } else if (note < 21) {
              note += 21;
            }
            if (note > 108) {
              note = 108;
            } else if (note < 21) {
              note = 21;
            }
          } else {
            note = note[0];
            if (note.indexOf('R') == 0 || note.indexOf('r') == 0) { // random letter
              note = random_n() + note.substr(1);
            }
            if (note.indexOf('r') == (note.length - 1)) { // random octave
              note = note.substr(0, note.length - 1) + rand(3, 6);
            } else if (note.indexOf('R') == (note.length - 1)) { // random octave
              note = note.substr(0, note.length - 1) + rand(0, 8);
            }
          }
          var lengths = notes[j].match(/L(\d{1,3}|R)/gi);
          var velocities = notes[j].match(/V([0-9]|R)/gi);
          var channels = notes[j].match(/(?<!^)H(\d{1,2}|R)/gi);
          var stutters = notes[j].match(/S(\d{1,3}|R)/gi);
          var length = playheads[p].length;
          if (lengths !== null) {
            var possible_l = lengths[0].replace('L', '');
            if (possible_l == 'r') {
              length = rand(1, 8);
            } else if (possible_l == 'R') {
              length = rand(1, 32);
            } else {
              length = parseInt(possible_l);
            }
          }
          var velocity = (playheads[p].velocity / 9.0);
          if (velocities !== null) {
            var v = parseInt(velocities[0].replace('V', ''));
            if (v == 'r') {
              velocity = rand(3, 6) / 9.0;
            } else if (v == 'R') {
              velocity = rand(1, 9) / 9.0;
            } else if (v > 0 && v <= 9.0) {
              velocity = v / 9.0;
            }
          }
          var channel = playheads[p].channel;
          if (channels !== null) {
            var possible_channel = channels[0].replace('H', '');
            if (possible_channel == 'R' || possible_channel == 'r') {
              channel = rand(1, 16);
            } else {
              channel = parseInt(possible_channel);
              channel = Math.max(1, channel);
              channel = Math.min(16, channel);
            }
          }

          if (!playheads[p].muted) {
            midiOutput.playNote(note, channel, {
              duration: (playheads[p].interval * length),
              velocity: velocity,
              time: playheads[p].nextNote
            });
          }
        }
        playheads[p].nextNote += playheads[p].interval;

        var coin_flip = false;
        var jumps = line_text.match(/J\[[a-z\d]+\]/gi);
        if (jumps !== null) {
          var label = jumps[0].replace('J', '').replace('[', '').replace(']', '').trim();
          if (label != '') {
            for (var search_index in lines[block_id]) {
              if (lines[block_id][search_index].indexOf("U[" + label + "]") > -1) {
                playheads[p].pos = parseInt(search_index);
                break;
              }
            }
          }
        } else if (line_text.indexOf('X') > -1) { // destroy playhead
          var flow_controls = line_text.match(/X(\d{1,3})/gi);
          if (flow_controls !== null) {
            var flow_control = parseInt(flow_controls[0].replace('X', ''));
            if (playheads[p].destroyed_count >= flow_control) {
              playheads[p].destroyed_count = 0;
              coin_flip = false;
            } else {
              coin_flip = true;
              playheads[p].destroyed_count++;
            }
          } else if (line_text.indexOf('XR') > -1) {
            coin_flip = rand(0, 1);
          } else if (line_text.indexOf('Xr') > -1) {
            coin_flip = rand(0, 32);
          }
          if (!coin_flip) {
            playheads.splice(p, 1);
            continue;
          } else {
            playheads[p].pos = parseInt(playheads[p].pos + playheads[p].direction);
          }
        } else if (line_text.indexOf('^') > -1) { // return to line of last creator symbol that the playhead ran over
          var flow_controls = line_text.match(/\^(\d{1,3})/gi);
          if (flow_controls !== null) {
            var flow_control = parseInt(flow_controls[0].replace('^', ''));
            if (playheads[p].returned_count >= flow_control) {
              playheads[p].returned_count = 0;
              coin_flip = true;
            } else {
              coin_flip = false;
              playheads[p].returned_count++;
            }
          } else if (line_text.indexOf('^R') > -1) {
            coin_flip = rand(0, 1);
          } else if (line_text.indexOf('^r') > -1) {
            coin_flip = rand(0, 32);
          }
          if (!coin_flip) {
            playheads[p].pos = playheads[p].last_creator - ((playheads[p].direction == 1) ? 1 : 0);
          }
          playheads[p].pos = parseInt(playheads[p].pos + playheads[p].direction);
        } else if (line_text.indexOf('{') > -1) { // turn backwards playhead forwards
          var flow_controls = line_text.match(/{(\d{1,3})/gi);
          if (flow_controls !== null) {
            var flow_control = parseInt(flow_controls[0].replace('{', ''));
            if (playheads[p].btof_count >= flow_control) {
              playheads[p].btof_count = 0;
              coin_flip = true;
            } else {
              coin_flip = false;
              playheads[p].btof_count++;
            }
          } else if (line_text.indexOf('{R') > -1) {
            coin_flip = rand(0, 1);
          } else if (line_text.indexOf('{r') > -1) {
            coin_flip = rand(0, 32);
          }
          if (!coin_flip) {
            if (playheads[p].direction == -1) {
              playheads[p].direction = 1;
            }
          }
          playheads[p].pos = parseInt(playheads[p].pos + playheads[p].direction);
        } else if (line_text.indexOf('}') > -1) { // turn forwards playhead backwards
          var flow_controls = line_text.match(/}(\d{1,3})/gi);
          if (flow_controls !== null) {
            var flow_control = parseInt(flow_controls[0].replace('}', ''));
            if (playheads[p].ftob_count >= flow_control) {
              playheads[p].ftob_count = 0;
              coin_flip = true;
            } else {
              coin_flip = false;
              playheads[p].ftob_count++;
            }
          } else if (line_text.indexOf('}R') > -1) {
            coin_flip = rand(0, 1);
          } else if (line_text.indexOf('}r') > -1) {
            coin_flip = rand(0, 32);
          }
          if (!coin_flip) {
            if (playheads[p].direction == 1) {
              playheads[p].direction = -1;
            }
          }
          playheads[p].pos = parseInt(playheads[p].pos + playheads[p].direction);
        } else if (line_text.indexOf('$') > -1) { // reverse playhead direction
          var flow_controls = line_text.match(/\$(\d{1,3})/gi);
          if (flow_controls !== null) {
            var flow_control = parseInt(flow_controls[0].replace('$', ''));
            if (playheads[p].toggle_count >= flow_control) {
              playheads[p].toggle_count = 0;
              coin_flip = false;
            } else {
              coin_flip = true;
              playheads[p].toggle_count++;
            }
          } else if (line_text.indexOf('$R') > -1) {
            coin_flip = rand(0, 1);
          } else if (line_text.indexOf('$r') > -1) {
            coin_flip = rand(0, 32);
          }
          if (!coin_flip) {
            if (playheads[p].direction == 1) {
              playheads[p].direction = -1;
            } else if (playheads[p].direction == -1) {
              playheads[p].direction = 1;
            }
          }
          playheads[p].pos = parseInt(playheads[p].pos + playheads[p].direction);
        } else if (line_text.indexOf('W') > -1) { // playhead wait for defined number of 16th notes
          var flow_controls = line_text.match(/W(\d{1,3})/gi);
          if (flow_controls !== null) {
            var flow_control = parseInt(flow_controls[0].replace('W', ''));
            if (playheads[p].wait_count >= flow_control) {
              playheads[p].wait_count = 0;
              coin_flip = false;
            } else {
              coin_flip = true;
              playheads[p].wait_count++;
            }
          } else if (line_text.indexOf('Wr') > -1) {
            coin_flip = rand(0, 1);
          } else if (line_text.indexOf('WR') > -1) {
            coin_flip = rand(0, 32);
          }
          if (!coin_flip) {
            playheads[p].pos = parseInt(playheads[p].pos + playheads[p].direction);
          }
        } else {
          playheads[p].pos = parseInt(playheads[p].pos + playheads[p].direction);
        }

        if (line_text.indexOf('+O') > -1) {
          playheads[p].default_note += 12;
        } else if (line_text.indexOf('+') > -1 && line_text.indexOf(':+') < 0) {
          playheads[p].default_note++;
        } else if (line_text.indexOf('-O') > -1) {
          playheads[p].default_note -= 12;
        } else if (line_text.indexOf('-') > -1 && line_text.indexOf(':-') < 0) {
          playheads[p].default_note--;
        }
        //constrain to piano key range
        if (playheads[p].default_note < 21) {
          playheads[p].default_note += 21;
        } else if (playheads[p].default_note > 108) {
          playheads[p].default_note -= 88;
        }
      }
    }

    if (global_beat_done) {
      for (var p in playheads) {
        // create div alongside textarea showing playhead pointers as > or numbers..
        var block_id = playheads[p].block;
        if (typeof playhead_div[block_id][playheads[p].pos] !== 'undefined') {
          playhead_div[block_id][playheads[p].pos] = playheads[p].label + '>' + playhead_div[block_id][playheads[p].pos];
        } else {
          playhead_div[block_id][0] = playheads[p].label + '>' + playhead_div[block_id][0];
        }
      }

      for (var b in block_ids) {
        document.getElementById("playheads" + block_ids[b]).innerHTML = playhead_div[block_ids[b]].join("");
      }
    }

  }

  setTimeout(poll, 1);
}

function calculate_interval(bpm, divisor) {
  interval = (1000.0 / (((bpm / divisor) * 16) / 60.0)); //fastest note is a 16th note
  return interval;
}

function create_block(options, after) {
  var new_block = {};

  options = options || {};

  if (typeof options.create_html !== 'undefined') {
    new_block.create_html = (parseInt(options.create_html) === 1);
  } else {
    new_block.create_html = true;
  }
  if (typeof options.muted !== 'undefined') {
    new_block.muted = (parseInt(options.muted) === 1 || options.muted === true);
  } else {
    new_block.muted = false;
  }
  if (typeof options.play !== 'undefined') {
    new_block.play = (parseInt(options.play) === 1 || options.play === true);
  } else {
    new_block.play = true;
  }
  if (typeof options.bar_play !== 'undefined') {
    new_block.bar_play = (parseInt(options.bar_play) === 1 || options.bar_play === true);
  } else {
    new_block.bar_play = false;
  }
  if (options.channel) {
    new_block.channel = parseInt(options.channel);
  } else {
    new_block.channel = gd_channel;
  }
  if (options.root_note) {
    new_block.root_note = parseInt(options.root_note);
  } else {
    new_block.root_note = gd_root_note;
  }
  if (options.divisor) {
    new_block.divisor = parseInt(options.divisor);
  } else {
    new_block.divisor = gd_divisor;
  }
  if (options.macro) {
    new_block.macro = options.macro;
  } else {
    new_block.macro = '';
  }
  if (options.block_id) {
    new_block.block_id = parseInt(options.block_id);
    next_block_id++;
  } else {
    new_block.block_id = next_block_id;
    next_block_id++;
  }

  new_block.solo = false;

  blocks.push(new_block);

  if (new_block.create_html) {
    html = '<div id="block_' + new_block.block_id + '" class="block">';
    html += '<div id="blockbar' + new_block.block_id + '" class="block-top-bar"><div class="block-title">BLOCK' + new_block.block_id + '</div><div class="block-toggle-solo">S</div><div class="block-toggle-mute">' + (new_block.muted ? 'M>' : 'M!') + '</div><div class="block-toggle-play">' + (new_block.play ? '>' : '!') + '</div><div class="block-bar-toggle-play">' + (new_block.bar_play ? 'B>' : 'B!') + '</div><div class="block-channel">CH' + new_block.channel + '</div><div class="block-rootnote">' + new_block.root_note + '</div><div class="block-divisor">/' + new_block.divisor + '</div><div class="delete-block">-</div><div class="add-block">+</div></div>';
    html += '<input id="macro' + new_block.block_id + '" type="text" value="' + new_block.macro + '" class="macro" />';
    html += '<div id="blockscrollercontainer' + new_block.block_id + '" class="block-scroller-container">';
    html += '<div id="blockscroller' + new_block.block_id + '" class="block-scroller">';
    html += '<div id="playheads' + new_block.block_id + '" class="playheads"></div>';
    html += '<textarea id="editable' + new_block.block_id + '" class="editable"></textarea>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    if (typeof after !== 'undefined') {
      after.after(html);
    } else if ($('.block').length < 1) {
      $('body').prepend(html);
    } else {
      $('.block').last().after(html);
    }

    set_block_widths();
    $(".editable").each(function() {
      $(this).trigger('input');
    });
  }
}

function create_block_from_line(line) {
  var block_id = line.match(/\#BLOCKID:(\d{1,3})/gi);
  if (block_id === null) {
    return false;
  }
  block_id = parseInt(block_id[0].replace('#BLOCKID:', ''));

  var muted = 0;
  var play = 1;
  var bar_play = 0;
  var channel = gd_channel;
  var root_note = gd_root_note;
  var divisor = gd_divisor;
  var macro = '';

  var mutes = line.match(/\#MUTED:(\d{1,3})/gi);
  if (mutes !== null) {
    muted = (parseInt(mutes[0].replace('#MUTED:', '')) === 1);
  }
  var plays = line.match(/\#PLAY:(\d{1,3})/gi);
  if (plays !== null) {
    play = (parseInt(plays[0].replace('#PLAY:', '')) === 1);
  }
  var bar_plays = line.match(/\#BARPLAY:(\d{1,3})/gi);
  if (bar_plays !== null) {
    bar_play = (parseInt(bar_plays[0].replace('#BARPLAY:', '')) === 1);
  }
  var channels = line.match(/\#CHANNEL:(\d{1,3})/gi);
  if (channels !== null) {
    channel = parseInt(channels[0].replace('#CHANNEL:', ''));
  }
  var root_notes = line.match(/\#ROOTNOTE:(\d{1,3})/gi);
  if (root_notes !== null) {
    root_note = parseInt(root_notes[0].replace('#ROOTNOTE:', ''));
  }
  var divisors = line.match(/\#DIVISOR:(\d{1,3})/gi);
  if (divisors !== null) {
    divisor = parseInt(divisors[0].replace('#DIVISOR:', ''));
  }
  var macros = line.match(/\#MACRO:([^\#]+)\#/gi);
  if (macros !== null) {
    macro = macros[0].replace('#MACRO:', '').replace('#', '');
  }

  create_block({
    'block_id': block_id,
    'muted': muted,
    'play': play,
    'bar_play': bar_play,
    'channel': channel,
    'root_note': root_note,
    'divisor': divisor,
    'macro': macro
  });
}

function create_playhead(options) {
  var new_playhead = {};

  options = options || {};

  var block_object = false;

  if (options.block) {
    new_playhead.block = options.block;
  } else {
    new_playhead.block = 1;
  }

  for (var b in blocks) {
    if (blocks[b].block_id == new_playhead.block) {
      block_object = blocks[b];
    }
  }

  if (options.pos) {
    new_playhead.pos = parseInt(options.pos);
  } else {
    new_playhead.pos = gd_pos;
  }
  if (options.channel) {
    new_playhead.channel = options.channel;
  } else if (block_object !== false) { // first, try to inherit from block
    new_playhead.channel = block_object.channel;
  } else {
    new_playhead.channel = gd_channel;
  }
  if (options.octave) {
    new_playhead.octave = options.octave;
  } else {
    new_playhead.octave = gd_octave;
  }
  if (options.length) {
    new_playhead.length = options.length;
  } else {
    new_playhead.length = gd_length;
  }
  if (options.velocity) {
    new_playhead.velocity = options.velocity;
  } else {
    new_playhead.velocity = gd_velocity;
  }
  if (options.bpm) {
    new_playhead.bpm = options.bpm;
  } else {
    new_playhead.bpm = gd_bpm;
  }
  if (options.divisor) {
    new_playhead.divisor = options.divisor;
  } else if (block_object !== false) { // first, try to inherit from block
    new_playhead.divisor = block_object.divisor;
  } else {
    new_playhead.divisor = gd_divisor;
  }
  new_playhead.interval = calculate_interval(new_playhead.bpm, new_playhead.divisor);
  if (options.root_note) {
    new_playhead.root_note = options.root_note;
  } else {
    new_playhead.root_note = gd_root_note;
  }
  if (options.default_note) {
    new_playhead.default_note = options.default_note;
  } else if (block_object !== false) { // first, try to inherit from block
    new_playhead.default_note = block_object.root_note;
  } else {
    new_playhead.default_note = gd_default_note;
  }
  new_playhead.previous_line = new_playhead.pos;

  if (options.nextNote) {
    new_playhead.nextNote = options.nextNote;
  } else {
    new_playhead.nextNote = WebMidi.time;
  }

  if (typeof options.play !== 'undefined') {
    new_playhead.play = options.play;
  } else if (block_object !== false) { // first, try to inherit from block
    new_playhead.play = block_object.play;
  } else {
    new_playhead.play = true;
  }

  if (typeof options.muted !== 'undefined') {
    new_playhead.muted = options.muted;
  } else if (block_object !== false) { // first, try to inherit from block
    new_playhead.muted = block_object.muted;
  } else {
    new_playhead.muted = false;
  }

  new_playhead.last_creator = 0;

  new_playhead.label = playhead_id_number;
  playhead_id_number++;

  new_playhead.stutters = [];

  if (options.direction) {
    new_playhead.direction = options.direction;
  } else {
    new_playhead.direction = 1;
  }

  new_playhead.toggle_count = 0;
  new_playhead.ftob_count = 0;
  new_playhead.btof_count = 0;
  new_playhead.destroyed_count = 0;
  new_playhead.returned_count = 0;
  new_playhead.wait_count = 0;
  new_playhead.rotate_lines = [];

  playheads.push(new_playhead);
}

function create_playhead_from_line(block, pos, line_text) {
  var line_text = line_text.split('#')[0].trim();

  var creators = line_text.match(/>(:(\d{1,3}|R))?(H(\d{1,2}|R))?(O(\d|R))?(B(\d{1,3}|R))?(DI(\d|R))?(\\(\d{1,3}|R))?/gi);

  if (creators !== null) {
    var creator = creators[0];
    var every_nth = creator.match(/:(\d{1,3}|R)/gi);
    var channels = creator.match(/H(\d{1,2}|R)/gi);
    var octaves = creator.match(/O(\d|R)/gi);
    var bpms = creator.match(/B(\d{1,3}|R)/gi);
    var divisors = creator.match(/\\(\d{1,3}|R)/gi);
    var dirs = creator.match(/DI(\d|R)/gi);

    var is_recurring = false;
    var possible_nth = 0;
    if (every_nth !== null) {
      possible_nth = every_nth[0].replace(':', '');
      var is_random_recurring = false;
      if (possible_nth == 'r') {
        is_random_recurring = true;
        possible_nth = rand(1, 8);
      } else if (possible_nth == 'R') {
        is_random_recurring = true;
        possible_nth = rand(1, 1024);
      } else {
        possible_nth = parseInt(possible_nth);
      }
      if (possible_nth > 0) {
        is_recurring = true;
        if (is_random_recurring && global_beats == 0) {
          if (rand(1, 2) == 1) {
            return true;
          }
        } else if (global_beats % possible_nth !== 0) {
          return true;
        }
      } else {
        return false;
      }
    } else if (line_text.indexOf('>:') > -1) {
      return false;
    }

    if (playheads.length >= playhead_limit) {
      return true;
    }

    var new_playhead = {
      'nextNote': global_nextNote,
      'block': parseInt(block),
      'pos': parseInt(pos),
      'octave': gd_octave,
      'bpm': gd_bpm,
      'direction': 1
    };

    if (channels !== null) {
      var possible_channel = channels[0].replace('H', '');
      if (possible_channel == 'R' || possible_channel == 'r') {
        possible_channel = rand(1, 16);
      } else {
        possible_channel = parseInt(possible_channel);
      }
      if (possible_channel > 0) {
        new_playhead.channel = possible_channel;
      }
    }
    if (octaves !== null) {
      var possible_octave = octaves[0].replace('O', '');
      if (possible_octave == 'r') {
        possible_octave = rand(3, 6);
      } else if (possible_octave == 'R') {
        possible_octave = rand(0, 8);
      } else {
        possible_octave = parseInt(possible_octave);
      }
      if (possible_octave > 0) {
        new_playhead.octave = possible_octave;
      }
    }
    if (bpms !== null) {
      var possible_bpm = bpms[0].replace('B', '');
      if (possible_bpm == 'r') {
        possible_bpm = rand(30, 60);
      } else if (possible_bpm == 'R') {
        possible_bpm = rand(1, 120);
      } else {
        possible_bpm = parseInt(possible_bpm);
      }
      if (possible_bpm > 0) {
        new_playhead.bpm = possible_bpm;
      }
    }
    if (divisors !== null) {
      var possible_divisor = divisors[0].replace('\\', '');
      if (possible_divisor == 'r') {
        possible_divisor = rand(1, 16);
      } else if (possible_divisor == 'R') {
        possible_divisor = rand(1, 256);
      } else {
        possible_divisor = parseInt(possible_divisor);
      }
      if (possible_divisor > 0) {
        new_playhead.divisor = possible_divisor;
      }
    }
    if (dirs !== null) {
      var possible_dir = dirs[0].replace('DI', '');
      if (possible_dir == 'R' || possible_dir == 'r') {
        possible_dir = rand(0, 1);
      } else {
        possible_dir = parseInt(possible_dir);
      }
      if (possible_dir == 0 || possible_dir == 1) {
        new_playhead.direction = (possible_dir == 0) ? -1 : 1;
      }
    }

    create_playhead(new_playhead);

  }
}

function rand(min, max) {
  var r = Math.round(Math.random() * (max - min) + min);
  return r;
}

function random_n() {
  return note_letters[rand(0, 11)];
}

function set_block_widths() {
  var number_of_blocks = $('.block').length;
  var number_of_blocks_per_row = ceil(number_of_blocks / rows);
  var block_width = 100.0 / number_of_blocks_per_row;
  var block_width_string = 'calc(' + block_width + '% - 14px)';
  $('.block').attr('style', 'width: -webkit-' + block_width_string + '; width:moz-' + block_width_string + '; width:' + block_width_string + ';height:-webkit-calc(' + (100.0 / rows) + '% - 37px);height:-moz-calc(' + (100.0 / rows) + '% - 37px);height:calc(' + (100.0 / rows) + '% - 37px)');

  $('.block').each(function() {
    var block_id = parseInt($(this).attr('id').split('_')[1]);
    if (!block_ids.includes(block_id)) {
      block_ids.push(block_id);
    }
  });
}

function euclid(onsets, total) {
  var previous = null;
  var pattern = [];

  for (var i = 0; i < total; i++) {
    var x = Math.floor((onsets  / total) * i);
    pattern.push(x === previous ? 0 : 1);
    previous = x;
  }
  
  return pattern;
}

function load_scale_notes() {
  for (var s in scales) {
    if (scales[s].label != scale) {
      continue;
    }

    scale_notes = scales[s].notes;
    break;
  }
}

WebMidi.enable(function(err) {
  if (err) {
    alert("WebMidi could not be enabled.\r\n" + err);
    console.log("WebMidi could not be enabled.", err);
  }

  if (WebMidi.outputs.length == 0) {
    alert("No MIDI outputs detected");
  }

  for (var o in WebMidi.outputs) {
    $('#midi-container').append('<div>' + WebMidi.outputs[o].name + '</div>');
  }

  midiOutput = WebMidi.getOutputByName(WebMidi.outputs[0].name);

  $('#midi-output').text(WebMidi.outputs[0].name);


});


$(document).ready(function() {

  set_block_widths();

  $(document).on('keydown', function(e) {
    if (e.which == 17) { //CTRL - spawn playhead on current line, if editable is focused

    } else if (e.which == 18) { //ALT - toggle play / pause
      if (!playing) {
        global_beats = 0;
        global_bar_beats = 0;
        global_nextNote = WebMidi.time;
        if (was_reset) {
          $('.block').each(function() {
            var block_id = parseInt($(this).attr('id').split('_')[1]);
            var lines = document.getElementById("editable" + block_id).value.split("\n");
            for (var i in lines) {
              if (lines[i].indexOf('>') > -1 && lines[i].indexOf('>:') < 0) {
                create_playhead_from_line(block_id, i, lines[i]);
              }
            }
          });
        }
        for (var i in playheads) {
          playheads[i].nextNote = global_nextNote;
        }
        was_reset = false;
      }
      playing = !playing;
      document.getElementById("playing-paused").innerHTML = playing ? 'PLAYING' : 'PAUSED';
      console.log(playing ? 'started' : 'stopped');
    } else if (e.which == 27) { // ESC - pause and reset
      playing = false;
      was_reset = true;

      //key = "C";
      //scale = "C";
      gd_pos = 0;
      gd_channel = 1;
      gd_octave = 4;
      gd_length = 1;
      gd_velocity = 5;
      //gd_bpm = 60.0;
      gd_divisor = 1;
      gd_root_note = 48;
      gd_default_note = 48;
      playheads = [];
      playhead_id_number = 0;
      global_beats = 0;
      global_bar_beats = 0;

      // clear playheads div contents
      $(".playheads").html('');

      beat_indicator.innerHTML = '';
      whole_note_indicator.innerHTML = '';
      /*document.getElementById("global-scale").innerHTML = scale;
      document.getElementById("global-key").innerHTML = key;
      $('#global-bpm').text(global_bpm);
      global_interval = calculate_interval(global_bpm, global_divisor);*/

      for (var b in blocks) {
        blocks[b].bar_play = false;
      }
      $('.block-bar-toggle-play').text('B!');

      console.log('reset');
      document.getElementById("playing-paused").innerHTML = 'RESET';
    }
  });

  $(document).on('keyup', function(e) {

    if (e.which == 27) { // ESC - pause and reset
      document.getElementById("playing-paused").innerHTML = 'PAUSED';
    }
  });

  $(document).on("input paste keydown", ".editable", function() {
    var lines = $(this).val().split("\n");
    $(this).closest('.block-scroller').height(((lines.length * 9) + 1) + 'px');
    $(this).scrollLeft(0);
  });

  $('#save').click(function() {
    var sketch_string = "#SCALE:'" + scale + "'#KEY:" + key + "#BPM:" + global_bpm + "#ROWS:" + rows + "\r\n";

    $('.block').each(function() {
      var block_id = parseInt($(this).attr('id').split('_')[1]);
      var lines = document.getElementById("editable" + block_id).value;
      var macro = document.getElementById("macro" + block_id).value;
      var block = false;
      for (var b in blocks) {
        if (blocks[b].block_id == block_id) {
          block = blocks[b];
          break;
        }
      }
      if (block === false) {
        return true;
      }

      // add block parameters after block_id like {param}:{integer-value}
      sketch_string += '#BLOCKID:' + block_id + '#MUTED:' + (block.muted ? 1 : 0) + '#PLAY:' + (block.play ? 1 : 0) + '#BARPLAY:' + (block.bar_play ? 1 : 0) + '#CHANNEL:' + block.channel + '#ROOTNOTE:' + block.root_note + '#DIVISOR:' + block.divisor + '#MACRO:' + macro + '#-----' + "\r\n";
      sketch_string += lines + "\r\n";
    });

    $('#view-container').val(sketch_string);
    $('#view-splash').addClass('splashed');

  });

  $('#load').click(function() {
    $('#load-container').val('');
    $('#load-splash').addClass('splashed');
  });

  $('.splash textarea').focus(function() {
    $(this).select();
  });

  $('.close').click(function() {
    $(this).closest('.splash').removeClass('splashed');
  });

  $('.load').click(function() {
    var text_string = $('#load-container').val();

    var possible_scale = text_string.match(/\#SCALE:'[A-Za-z\s]+'/gi);
    var possible_key = text_string.match(/\#KEY:([A-Za-z])/gi);
    var possible_bpm = text_string.match(/\#BPM:(\d+)/gi);
    var possible_rows = text_string.match(/\#ROWS:(\d+)/gi);

    if (possible_scale !== null) {
      scale = possible_scale[0].replace("#SCALE:", '').replace(/'/g, '');
    }
    if (possible_key !== null) {
      key = possible_key[0].replace("#KEY:", '');
      for (var k in note_letters) {
        if (note_letters[k] == key) {
          key_index = parseInt(k);
          break;
        }
      }
    }
    if (possible_bpm !== null) {
      global_bpm = parseInt(possible_bpm[0].replace("#BPM:", ''));
    }
    if (possible_rows !== null) {
      rows = parseInt(possible_rows[0].replace("#ROWS:", ''));
    }
    document.getElementById("global-scale").innerHTML = scale;
    document.getElementById("global-key").innerHTML = key;
    document.getElementById("rows").innerHTML = rows;
    $('#global-bpm').text(global_bpm);
    global_interval = calculate_interval(global_bpm, global_divisor);
    load_scale_notes();

    var lblocks = text_string.split('#BLOCKID:');
    if (typeof lblocks === 'undefined') {
      return false;
    }

    playheads = [];
    blocks = [];
    block_ids = [];
    playhead_div = [];

    $('.block').remove();

    for (var b in lblocks) {
      var block_text = '#BLOCKID:' + lblocks[b];
      var lines = block_text.split("\n");
      if (typeof lines === 'undefined') {
        continue;
      }

      var first_line = lines.slice(0, 1)[0];
      var block_id = first_line.match(/\#BLOCKID:(\d{1,3})/gi);
      if (block_id === null) {
        continue;
      }
      block_id = parseInt(block_id[0].replace('#BLOCKID:', ''));

      create_block_from_line(first_line);

      if (lines.length > 1) {
        var lines = lines.slice(1, (lines.length - 1));

        for (var l in lines) {
          lines[l] = lines[l].trim();
        }

        $('#editable' + block_id).val(lines.join("\r\n")).trigger('input');
      }
    }

    $('.splash').removeClass('splashed');
  });

  $('#global-scale, #global-key, #global-bpm').click(function() {
    $('#global-splash .selected').removeClass('selected');
    $('#scale-container > div').each(function() {
      if ($(this).text() == scale) {
        $(this).addClass('selected');
        return false;
      }
    });
    $('#key-container > div').each(function() {
      if ($(this).text() == key) {
        $(this).addClass('selected');
        return false;
      }
    });
    $('#global-splash').addClass('splashed');
    $('#tempo-container > div').each(function(index) {
      if ($(this).text() == global_bpm) {
        $(this).addClass('selected');
        $('#tempo-container').scrollTop(index * 12);
        return false;
      }
    });

  });

  $('#rows').click(function() {
    $('#rows-splash .selected').removeClass('selected');
    $('#rows-splash').addClass('splashed');
    $('#rows-container > div').each(function(index) {
      if ($(this).text() == rows) {
        $(this).addClass('selected');
        $('#rows-container').scrollTop(index * 12);
        return false;
      }
    });
  });

  $(document).on('click', '#rows-splash .multi-choice > div', function() {
    var parent = $(this).closest('.multi-choice');
    var value = parseInt($(this).text());
    parent.find('.selected').removeClass('selected');
    $(this).addClass('selected');

    rows = value;

    set_block_widths();
  });

  var parent_block_id = 0;
  var parent_block_index = 0;
  $(document).on('click', '.block-channel, .block-rootnote, .block-divisor', function() {
    $('#block-splash .selected').removeClass('selected');
    var parent_block = $(this).closest('.block');
    parent_block_id = parseInt(parent_block.attr('id').split('_')[1]);
    var block_object = false;
    for (var b in blocks) {
      if (blocks[b].block_id == parent_block_id) {
        block_object = blocks[b];
        parent_block_index = b;
        break;
      }
    }
    if (block_object === false) {
      return true;
    }
    $('#block-splash').addClass('splashed');
    $('#channel-container > div').each(function(index) {
      if ($(this).text() == block_object.channel) {
        $(this).addClass('selected');
        $('#channel-container').scrollTop(index * 12);
        return false;
      }
    });
    $('#rootnote-container > div').each(function(index) {
      if ($(this).text() == block_object.root_note) {
        $(this).addClass('selected');
        $('#rootnote-container').scrollTop(index * 12);
        return false;
      }
    });
    $('#divisor-container > div').each(function(index) {
      if ($(this).text() == block_object.divisor) {
        $(this).addClass('selected');
        $('#divisor-container').scrollTop(index * 12);
        return false;
      }
    });

  });

  $(".editable").first().focus();

  $('#global-bpm').text(global_bpm);

  for (var s in scales) {
    $('#scale-container').append('<div class="scale-choice">' + scales[s].label + '</div>');
  }
  for (var k in note_letters) {
    $('#key-container').append('<div class="key-choice">' + note_letters[k] + '</div>');
  }
  for (var pb = 10; pb <= 240; pb++) {
    $('#tempo-container').append('<div class="tempo-choice">' + pb + '</div>');
  }

  for (var pc = 1; pc <= 16; pc++) {
    $('#channel-container').append('<div class="channel-choice">' + pc + '</div>');
  }
  for (var pn = 0; pn <= 127; pn++) {
    $('#rootnote-container').append('<div class="rootnote-choice">' + pn + '</div>');
  }
  for (var pd = 1; pd <= 128; pd++) {
    $('#divisor-container').append('<div class="divisor-choice">' + pd + '</div>');
  }

  $(document).on('click', '#global-splash .multi-choice > div', function() {
    var parent = $(this).closest('.multi-choice');
    var value = $(this).text();
    parent.find('.selected').removeClass('selected');
    $(this).addClass('selected');
    if (parent.is('#scale-container')) {
      scale = value;
    } else if (parent.is('#key-container')) {
      key = value;
      for (var k in note_letters) {
        if (note_letters[k] == key) {
          key_index = parseInt(k);
          break;
        }
      }
    } else if (parent.is('#tempo-container')) {
      global_bpm = parseInt(value);
      for (var p in playheads) {
        playheads[p].bpm = global_bpm;
        playheads[p].interval = calculate_interval(playheads[p].bpm, playheads[p].divisor);
      }
    }
    document.getElementById("global-scale").innerHTML = scale;
    document.getElementById("global-key").innerHTML = key;
    $('#global-bpm').text(global_bpm);
    global_interval = calculate_interval(global_bpm, global_divisor);
    load_scale_notes();
  });

  $(document).on('click', '#block-splash .multi-choice > div', function() {
    var parent = $(this).closest('.multi-choice');
    var value = parseInt($(this).text());
    parent.find('.selected').removeClass('selected');
    $(this).addClass('selected');
    if (parent.is('#channel-container')) {
      blocks[parent_block_index].channel = value;
    } else if (parent.is('#rootnote-container')) {
      blocks[parent_block_index].root_note = value;
    } else if (parent.is('#divisor-container')) {
      blocks[parent_block_index].divisor = parseInt(value);
    }
    $('#block_' + parent_block_id + ' .block-channel').text('CH' + blocks[parent_block_index].channel);
    $('#block_' + parent_block_id + ' .block-rootnote').text(blocks[parent_block_index].root_note);
    $('#block_' + parent_block_id + ' .block-divisor').text('/' + blocks[parent_block_index].divisor);

    for (var p in playheads) {
      if (playheads[p].block == parent_block_id) {
        playheads[p].channel = blocks[parent_block_index].channel;
        playheads[p].default_note = blocks[parent_block_index].root_note; // for 'I' notes - which are constrained to the key + scale
        playheads[p].divisor = blocks[parent_block_index].divisor;
        playheads[p].interval = calculate_interval(playheads[p].bpm, playheads[p].divisor);
      }
    }

    global_interval = calculate_interval(global_bpm, global_divisor);
    load_scale_notes();
  });

  $(document).on('click', '.block-toggle-solo', function() {
    var block = $(this).closest('.block');
    var block_id = parseInt(block.attr('id').split('_')[1]);

    var block_object = false;

    for (var b in blocks) {
      if (blocks[b].block_id == block_id) {
        blocks[b].solo = !blocks[b].solo;
        block_object = blocks[b];
      } else {
        blocks[b].solo = false;
      }
      $('#block_' + blocks[b].block_id + ' .block-toggle-solo').text(blocks[b].solo ? '>S' : 'S');
    }
    if (block_object === false) {
      return true;
    }

    for (var b in blocks) {
      if (blocks[b].block_id == block_id) {
        blocks[b].muted = false;
      } else {
        blocks[b].muted = block_object.solo;
      }
      $('#block_' + blocks[b].block_id + ' .block-toggle-mute').text(blocks[b].muted ? 'M>' : 'M!');
    }

    for (var p in playheads) {
      if (playheads[p].block == block_id) {
        playheads[p].muted = false;
      } else {
        playheads[p].muted = block_object.solo;
      }
    }
  });

  $(document).on('click', '.block-toggle-mute', function() {
    var block = $(this).closest('.block');
    var block_id = parseInt(block.attr('id').split('_')[1]);

    var block_object = false;

    for (var b in blocks) {
      if (blocks[b].block_id == block_id) {
        block_object = blocks[b];
      }
    }
    if (block_object === false) {
      return true;
    }
    block_object.muted = !block_object.muted;
    $('#block_' + block_id + ' .block-toggle-mute').text(block_object.muted ? 'M>' : 'M!');

    for (var p in playheads) {
      if (playheads[p].block == block_id) {
        playheads[p].muted = block_object.muted;
      }
    }
  });

  $(document).on('click', '.block-toggle-play', function() {
    var block = $(this).closest('.block');
    var block_id = parseInt(block.attr('id').split('_')[1]);

    var block_object = false;

    for (var b in blocks) {
      if (blocks[b].block_id == block_id) {
        block_object = blocks[b];
      }
    }
    if (block_object === false) {
      return true;
    }
    block_object.play = !block_object.play;
    $('#block_' + block_id + ' .block-toggle-play').text(block_object.play ? '>' : '!');

    for (var p in playheads) {
      if (playheads[p].block == block_id) {
        playheads[p].play = block_object.play;
      }
    }
  });
  $(document).on('click', '.block-bar-toggle-play', function() {
    var block = $(this).closest('.block');
    var block_id = parseInt(block.attr('id').split('_')[1]);

    var block_object = false;

    for (var b in blocks) {
      if (blocks[b].block_id == block_id) {
        block_object = blocks[b];
      }
    }
    if (block_object === false) {
      return true;
    }
    block_object.bar_play = !block_object.bar_play;
    $('#block_' + block_id + ' .block-bar-toggle-play').text(block_object.bar_play ? 'B>' : 'B!');
  });

  $(document).on('click', '.add-block', function() {
    var prev_block = $(this).closest('.block');

    create_block(null, prev_block);
  });

  $(document).on('click', '.delete-block', function() {
    var block = $(this).closest('.block');
    var block_id = parseInt(block.attr('id').split('_')[1]);

    for (var p in playheads) {
      if (playheads[p].block == block_id) {
        playheads.splice(p, 1);
      }
    }

    block.remove();

    blocks = [];
    block_ids = [];
    playhead_div = [];

    set_block_widths();
  });

  $('#top-bar-title').click(function() {
    $('#about-splash').addClass('splashed');
  });

  $('#midi-output').click(function() {
    $('#midi-splash .selected').removeClass('selected');
    $('#midi-splash').addClass('splashed');
    $('#midi-container > div').each(function(index) {
      if ($(this).text() == $('#midi-output').text()) {
        $(this).addClass('selected');
        $('#midi-container').scrollTop(index * 12);
        return false;
      }
    });
  });
  $(document).on('click', '#midi-container > div', function() {
    var parent = $(this).closest('.multi-choice');
    var value = $(this).text();
    parent.find('.selected').removeClass('selected');
    $(this).addClass('selected');

    midiOutput = WebMidi.getOutputByName(value);
    $('#midi-output').text(value);
  });

  $(document).on('input paste', '.macro', function() {
    var macros = $(this).val();
    var block = $(this).closest('.block');
    var block_id = parseInt(block.attr('id').split('_')[1]);
    var editable = block.find('.editable');

    var block_object = false;

    for (var b in blocks) {
      if (blocks[b].block_id == block_id) {
        block_object = blocks[b];
      }
    }
    if (block_object === false) {
      return true;
    }

    var new_lines = ['>'];

    // note, number, length
    var euclideans = macros.match(/euc(\([^\(\)]+\))/gi);
    for (var i in euclideans) {
      var euclidean = euclideans[i].replace('euc(', '').replace(')', '').split(',');
      if (euclidean.length < 3) {
        continue;
      }
      var note = euclidean[0];
      var number = parseInt(euclidean[1]);
      var length = parseInt(euclidean[2]);
      var rotation = 0;
      if(typeof euclidean[3] !== 'undefined' && !isNaN(parseInt(euclidean[3]))){
        rotation = parseInt(euclidean[3]);
        if(rotation >= length){
          rotation = length - 1;
        }
      }
      
      if(number>0 && length>0){
        var gcd = euclid(number, length);

        for (var j = 0; j < length; j++) {
          if (typeof new_lines[j] === 'undefined') {
            new_lines[j] = '';
          }
          k = j - rotation;
          if(k < 0){
            k+=length;
          }else if(k >= length){
            k-=length;
          }
          
          if (gcd[k] == 1) {
            new_lines[j] += note.replace(/;/g,',');
          }
        }
      }
    }



    editable.val(new_lines.join("\r\n")).trigger('input');
  });

});