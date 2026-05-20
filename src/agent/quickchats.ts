export type Category =
  | "Information"
  | "Compliments"
  | "Reactions"
  | "Apologies"
  | "PostGame";

export interface Quickchat {
  category: Category;
  text: string;
  /**
   * Abstract scenario descriptions where this quickchat lands.
   * Phrased away from Rocket League specifics — the broader the description,
   * the more unexpected real-world moments can match into it. Each item is
   * a sincere situational description (sincere OR ironic deployments both
   * appear as plain "when X" sentences with no tonal labeling).
   */
  useCases: string[];
}

/**
 * Standard in-game Rocket League quickchat strings.
 * Source: factual game data, not generated.
 */
export const QUICKCHATS: readonly Quickchat[] = [
  // Information
  {
    category: "Information",
    text: "I got it!",
    useCases: [
      "Stepping forward when there's a thing to be handled",
      "Claiming the next move before anyone else",
      "Volunteering for whatever's in front of you",
    ],
  },
  {
    category: "Information",
    text: "Need boost!",
    useCases: [
      "Asking for more of whatever keeps you going",
      "Signaling reserves are running low",
      "Theatrically begging for replenishment of any kind",
    ],
  },
  {
    category: "Information",
    text: "Take the shot!",
    useCases: [
      "Urging someone to commit to the move they're hesitating on",
      "Granting permission for the leap",
      "Egging someone toward a decision",
    ],
  },
  {
    category: "Information",
    text: "Defending.",
    useCases: [
      "Holding position while pressure builds",
      "Staying back and refusing to commit",
      "Claiming the cautious role, deserved or not",
    ],
  },
  {
    category: "Information",
    text: "Go for it!",
    useCases: [
      "Unqualified encouragement toward the leap",
      "Green-lighting whatever they're considering",
      "Cheering someone past their hesitation",
    ],
  },
  {
    category: "Information",
    text: "Centering!",
    useCases: [
      "Setting something up for someone else to finish",
      "Funneling momentum toward the next person",
      "Announcing a hand-off is in motion",
    ],
  },
  {
    category: "Information",
    text: "All yours.",
    useCases: [
      "Stepping aside and handing over the reins",
      "Yielding a decision or a mess to someone else",
      "Politely declining further involvement",
    ],
  },
  {
    category: "Information",
    text: "In position.",
    useCases: [
      "Confirming you've shown up and you're ready",
      "Reporting in at full attention",
      "Anchoring yourself where you were supposed to be",
    ],
  },
  {
    category: "Information",
    text: "Incoming!",
    useCases: [
      "Heads-up that something is about to land",
      "Warning the room to brace for impact",
      "Flagging an arrival that demands attention",
    ],
  },
  {
    category: "Information",
    text: "Faking.",
    useCases: [
      "Disclaiming the move you just looked like you'd make",
      "Walking back what you implied",
      "Confessing the gesture was a feint",
    ],
  },
  {
    category: "Information",
    text: "Bumping!",
    useCases: [
      "Applying pressure to dislodge a situation",
      "Pushing on a thing until something gives",
      "Inserting yourself to nudge an outcome",
    ],
  },
  {
    category: "Information",
    text: "On your left!",
    useCases: [
      "Pointing attention to one side",
      "Telling someone to look the other way",
    ],
  },
  {
    category: "Information",
    text: "On your right!",
    useCases: [
      "Pointing attention to the opposite side",
      "Telling someone to check the other direction",
    ],
  },
  {
    category: "Information",
    text: "Passing!",
    useCases: [
      "Handing the thing off cleanly",
      "Initiating a hand-off in motion",
    ],
  },
  {
    category: "Information",
    text: "This is Rocket League!",
    useCases: [
      "Throwing your hands up at the absurdity in front of you",
      "Resigned acknowledgment that things are nonsense",
      "Naming the chaos out loud",
    ],
  },

  // Compliments
  {
    category: "Compliments",
    text: "Nice shot!",
    useCases: [
      "When a precise effort lands exactly where intended",
      "Acknowledging a single decisive action that worked",
      "Reacting when the effort visibly missed its mark",
    ],
  },
  {
    category: "Compliments",
    text: "Great pass!",
    useCases: [
      "Crediting someone whose setup made the moment possible",
      "Recognizing invisible work that made yours easy",
      "Reacting when someone fumbled the hand-off between people",
    ],
  },
  {
    category: "Compliments",
    text: "Thanks!",
    useCases: [
      "Genuine gratitude for help, support, or showing up",
      "Acknowledging someone made your path easier",
      "Reacting when someone just made your path harder",
    ],
  },
  {
    category: "Compliments",
    text: "What a save!",
    useCases: [
      "Last-second rescue from impending disaster",
      "Recognizing a near-miss got pulled out of the fire",
      "Reacting when the rescue clearly did not happen",
    ],
  },
  {
    category: "Compliments",
    text: "Nice one!",
    useCases: [
      "Modest acknowledgment of a clean small win",
      "A warm 'well done' without making a thing of it",
      "Reacting when someone messes up in an unremarkable way",
    ],
  },
  {
    category: "Compliments",
    text: "What a play!",
    useCases: [
      "Marveling at a creative or improbable sequence",
      "Celebrating something that shouldn't have worked but did",
      "Reacting to an embarrassingly bad move",
    ],
  },
  {
    category: "Compliments",
    text: "Nice block!",
    useCases: [
      "Crediting someone for stopping a problem before it grew",
      "Acknowledging preventative success",
      "Reacting when someone failed to stop a foreseeable thing",
    ],
  },
  {
    category: "Compliments",
    text: "Nice bump!",
    useCases: [
      "Crediting just-right pressure that shifted things",
      "Acknowledging a well-timed nudge",
      "Reacting to a pointless or unhelpful bit of interference",
    ],
  },
  {
    category: "Compliments",
    text: "Nice demo!",
    useCases: [
      "Crediting someone for clearing the way decisively",
      "Acknowledging bold action that removed an obstacle",
      "Reacting when someone is on the receiving end of a steamroll",
    ],
  },

  // Reactions
  {
    category: "Reactions",
    text: "OMG!",
    useCases: [
      "Stunned at something wild that just happened",
      "Genuine shock at words or events",
      "Mock-shock at something completely predictable",
    ],
  },
  {
    category: "Reactions",
    text: "Noooo!",
    useCases: [
      "Heartbreak over a bad outcome",
      "Empathic dismay at someone else's news",
      "Theatrical refusal to accept what's happening",
      "expressing dismay at something that is actually good or inconsequential",
      "expressing genuine distress at something bad or disappointing",
    ],
  },
  {
    category: "Reactions",
    text: "Wow!",
    useCases: [
      "Genuine awe at something impressive",
      "Broad positive astonishment",
      "Flat 'wow' at something disappointing or dumb",
    ],
  },
  {
    category: "Reactions",
    text: "Close one!",
    useCases: [
      "Relief that a bad outcome was narrowly avoided",
      "Acknowledging a near-miss that worked out anyway",
      "Reacting when it absolutely was not close",
    ],
  },
  {
    category: "Reactions",
    text: "No way!",
    useCases: [
      "Disbelief at something improbable",
      "Playful refusal to accept news at face value",
      "Theatrical denial of something obviously true",
    ],
  },
  {
    category: "Reactions",
    text: "Calculated.",
    useCases: [
      "When a result has the air of having been planned all along",
      "Dry recognition that a plan worked exactly as drawn up",
      "Deadpan when someone is dressing up luck as intent",
      "Acknowledging an obvious blunder framed as strategy",
    ],
  },
  {
    category: "Reactions",
    text: "Savage!",
    useCases: [
      "Reacting to a brutal, dominant move",
      "Acknowledging someone went hard with harsh-but-earned results",
      "Reacting to a tame attempt at being cutting",
    ],
  },
  {
    category: "Reactions",
    text: "Okay.",
    useCases: [
      "Neutral acknowledgment without strong opinion",
      "Mild disengagement or unconvinced reception",
    ],
  },
  {
    category: "Reactions",
    text: "Siiiick!",
    useCases: [
      "Hyping a stylish, impressive achievement",
      "Matching high energy when something cool drops",
      "Reacting flatly to something deeply boring",
    ],
  },
  {
    category: "Reactions",
    text: "What a goal!",
    useCases: [
      "Celebrating a particularly memorable accomplishment",
      "Marking a big single moment someone shared",
      "Reacting to a botched outcome someone is trying to spin",
    ],
  },

  // Apologies
  {
    category: "Apologies",
    text: "Sorry!",
    useCases: [
      "Sincere quick apology for a mistake",
      "Owning that you fumbled something",
      "Performative apology when you're not actually sorry",
    ],
  },
  {
    category: "Apologies",
    text: "Whoops...",
    useCases: [
      "Light self-deprecation after a small misstep",
      "Acknowledging an awkward or clumsy moment",
      "Mock-innocent reaction to something you did on purpose",
    ],
  },
  {
    category: "Apologies",
    text: "My bad.",
    useCases: [
      "Casual quick ownership of a fault",
      "Brief acknowledgment without dwelling",
      "Mock self-blame for something clearly not your fault",
    ],
  },
  {
    category: "Apologies",
    text: "No problem.",
    useCases: [
      "Letting someone off the hook after they apologize",
      "Brushing aside thanks — minimizing your contribution",
      "Reacting when something is, in fact, still a problem",
    ],
  },
  {
    category: "Apologies",
    text: "Oops!",
    useCases: [
      "Lighthearted reaction to a small goof",
      "Catching yourself mid-mistake",
      "Mock surprise at a deliberate or expected outcome",
    ],
  },
  {
    category: "Apologies",
    text: "My fault.",
    useCases: [
      "Taking responsibility for an outcome",
      "Accepting blame without making excuses",
      "Theatrically claiming blame for something clearly not yours",
    ],
  },

  // PostGame
  {
    category: "PostGame",
    text: "gg",
    useCases: [
      "Friendly close to a shared competitive experience",
      "Wrapping up a session or interaction respectfully",
      "Throwing in the towel sarcastically when things just went badly",
    ],
  },
  {
    category: "PostGame",
    text: "Well played.",
    useCases: [
      "Recognizing someone did something well, after the fact",
      "Respectful acknowledgment of skill or effort shown",
      "Dry acknowledgment of a notably bad performance",
    ],
  },
  {
    category: "PostGame",
    text: "Rematch!",
    useCases: [
      "Wanting another go at the same thing",
      "Eagerness to run it all back",
      "Demanding another attempt at an outcome you can't accept",
    ],
  },
  {
    category: "PostGame",
    text: "One. More. Game.",
    useCases: [
      "Pushing for one more round of whatever you're doing",
      "Extending an activity past its natural stopping point",
      "Compulsively refusing to stop when you probably should",
    ],
  },
  {
    category: "PostGame",
    text: "What a game!",
    useCases: [
      "Reflecting on an intense or memorable shared experience",
      "Marveling at how eventful something just was",
      "Dryly reflecting on something that was actually a slog",
    ],
  },
  {
    category: "PostGame",
    text: "Everybody dance!",
    useCases: [
      "Pure celebration energy — let's vibe",
      "Spreading good vibes after something went well",
      "Ironic call to celebrate during an objectively bad moment",
    ],
  },
] as const;
