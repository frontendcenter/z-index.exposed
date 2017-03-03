export default [
  {
    title: "Text drawn after backgrounds",
    description: `
      One of the first surprising things about browser rendering is that text is actually drawn after block-level elements like divs.
      
      This means if non-positioned elements overlap (by using negative margin or overflow), the text will be drawn on top of their respective background boxes.
    `,
    code: `
      <div class="Box">
        <div class="Red">
          Red
        </div>
        <div class="Blue">
          Blue
        </div>
      </div>
    `,
  },
  {
    title: "Positioned elements drawn on top",
    description: `
      By adding \`position: relative\` to the first element, we see that it pops to the front—positioned elements are rendered after inline ones, even without a z-index.
    `,
    code: `
      <div class="Box">
        <div class="Red rel">
          Red
        </div>
        <div class="Blue">
          Blue
        </div>
      </div>
    `,
  },
  {
    title: "All things being equal, source order wins.",
    description: `
      Making them both \`position: relative\` means they get drawn in the order they appear in the document, like the first example. But unlike that example, the text "Red" appears between the two backgrounds—not above it.
      
      Try deleting the \`rel\` classes to see the effect.
    `,
    code: `
      <div class="Box">
        <div class="Red rel">
          Red
        </div>
        <div class="Blue rel">
          Blue
        </div>
      </div>
    `,
  },
  {
    title: "z-index overrides source order",
    description: `
      This is where z-indices behave totally as expected—elements are drawn in order of increasing \`z-index\`, or source order if they're equal.
      
      Play around with the ordering of the boxes. You can attach classes of \`z0\` \`z1\` \`z2\` \`z3\` or \`z4\`. 
    `,
    code: `
      <div class="Box">
        <div class="Red rel z1">
          Red
        </div>
        <div class="Blue rel z0">
          Blue
        </div>
      </div>
    `,
  },
  {
    title: "Default z-index (auto) is treated as 0 for ordering",
    description: `
      Here we can see that \`z-index: 0\` (class \`z0\`) doesn't bring it in front of a positioned element with \`z-index: auto\` (no \`z*\` class set).
      
      \`0\` and \`auto\` _are_ different in important ways though—not for the order in which _they're_ drawn, but the behaviour of their _descendants_. To see how, we need to consider how the browser handles z-index values below 0.
    `,
    code: `
      <div class="Box">
        <div class="Red rel z0">
          Red
        </div>
        <div class="Blue rel">
          Blue
        </div>
      </div>
    `,
  },
  {
    title: "Negative z-indices are drawn first of all",
    description: `
      Here you can see the Blue div is now behind the striped background of the Box. They're drawn in increasing order just like positive ones, except they're drawn before any of the other elements.
       
       Try adding \`rel z-2\` to the Red div. Note, you'll need both: \`z-2\` won't have any effect if the element isn't positioned (classnames \`rel\` \`abs\` or \`fixed\`).
    `,
    code: `
      <div class="Box">
        <div class="Red">
          Red
        </div>
        <div class="Blue rel z-1">
          Blue
        </div>
      </div>
    `,
  },
  {
    title: "Introducing a stacking context",
    description: `
      The \`z-index\` property isn't global—it only has an effect within a _Stacking Context_. Lots of things create stacking contexts—in this case \`position: relative\` and \`z-index: 0\` on the Box means that Blue's \`z-index: -1\` doesn't push it behind the Box's striped background.
      
      Delete \`z0\` from the Box the Blue box will jump behind again—positioned elements with  \`z-index: auto\` _don't_ create stacking contexts but those with any other \`z-index\` value do.
      
      Note: the elements that create stacking contexts have black outlines in the rendering order below.
    `,
    code: `
      <div class="Box rel z0">
        <div class="Red">
          Red
        </div>
        <div class="Blue rel z-1">
          Blue
        </div>
      </div>
    `,
  },
  {
    title: "Try your own.",
    description: `
      Understanding the way z-index values and stacking contexts get created requires interaction, so play around with some markup (or paste your own). Add your own CSS in a \`style\` tag and raise an issue if the Ordering calculator doesn't match the rendered output!
      
      These are the classes already defined for you to use:
      
          .right { text-align: right; }
          .rel { position: relative; }
          .abs { position: absolute; }
          .fixed { position: fixed; }
          
          .z0 { z-index: 0; }
          .z1 { z-index: 1; }
          .z2 { z-index: 2; }
          .z3 { z-index: 3; }
          .z4 { z-index: 4; }
          .z-1 { z-index: -1; }
          .z-2 { z-index: -2; }
          .z-3 { z-index: -3; }
          .z-4 { z-index: -4; }
      
      Good luck!
    `,
    code: `
      <style>
        .Box * { box-shadow: 0 0 4px -2px black; }
      </style>
      <div class="Box rel z0">
        <div class="Red">
          Red
        </div>
        <div class="Blue rel z-1">
          Blue
        </div>
        <div class="Green abs z4">
          Green
        </div>
      </div>
    `,
  },
]

const todo = [
  {
    title: "Nesting a z-1 still draws behind border",
    description: `
    `,
    code: `
      <div class="Box">
        <div class="Red">
          Red
          <div class="Blue rel z-1">
            Blue
          </div>
        </div>
      </div>
    `,
  },
  {
    title: "nested z-1 draws first in SC",
    description: `
    `,
    code: `
      <div class="Blue rel">
        <div class="Red">
          Red
          <div class="Blue rel z-1">
            Blue
          </div>
        </div>
      </div>
    `,
  },
  {
    title: "Pos: rel z-1",
    description: `
    `,
    code: `
      <div class="Box">
        <div class="Red rel z-1">
          Red
        </div>
        <div class="Blue">
          Blue
        </div>
      </div>
    `,
  },
  {
    title: "fuckt",
    description: `
    `,
    code: `
      <div class="Box rel">
        <div class="Red rel z2">
          Red
        </div>
        <div class="Blue rel z2">
          Blue
        </div>
      </div>
    `,
  },
  {
    title: "Pos: rel z-1 in new SC",
    description: `
    `,
    code: `
      <div class="Box rel z0">
        <div class="Red">
          Red
          <div class="Blue">
            Blue
          </div>
        </div>
        <div class="Green rel z-1">
          Green
        </div>
      </div>
    `,
  },
  {
    title: "nested z-1 in z-1",
    description: `
    `,
    code: `
      <div class="Box rel z-1">
        <div class="Red">
          Red
          <div class="Blue rel z-1">
            Blue
          </div>
        </div>
      </div>
    `,
  },
  {
    title: "Nesting1",
    description: `
    `,
    code: `
      <div class="Box">
        <div class="Red">
          Red
        </div>
        <div>
          <div class="Blue">
            Blue
          </div>
        </div>
      </div>
    `,
  },
  {
    title: "Nesting2",
    description: `
    `,
    code: `
      <div class="Box">
        <div class="Red">
          Red
        </div>
        <div>
          <div class="Blue rel z-1">
            Blue
          </div>
        </div>
      </div>
    `,
  },
  {
    title: "Nesting3",
    description: `
    `,
    code: `
      <div class="Box">
        <div class="Red">Red</div>
        <div class="rel">
          <div class="Blue rel z-1">
            Blue
          </div>
        </div>
      </div>
    `,
  },
  {
    title: "Nesting4",
    description: `
    `,
    code: `
      <div class="Box">
        <div class="Red">Red</div>
      <Div rel z0>
          <div class="Blue" rel z-1>Blue</div>
      </Div>
      </div>`,
  },

  {
    title: "Nested, drawn in doc order.",
    description: `
    `,
    code: `
      <div class="Box">
        <div class="Red">Red
          <div class="Blue">Blue</div>
      </div>
      <Green>Green</Green>
      </div>`,
  },
  {
    title: "Middle p:rel, draws on top.",
    description: `
    `,
    code: `
      <div class="Box">
        <div class="Red">Red
          <div class="Blue" rel>Blue</div>
      </div>
      <Green>Green</Green>
      </div>`,
  },
  {
    title: "Second two p:rel. No text overlap.",
    description: `
    `,
    code: `
      <div class="Box">
        <div class="Red">Red
          <div class="Blue" rel>Blue</div>
      </div>
      <Green rel>Green</Green>
      </div>`,
  },
  {
    title: "Middle z0 doesnt beat z-auto",
    description: `
    `,
    code: `
      <div class="Box">
        <div class="Red">Red
          <div class="Blue" rel z0>Blue</div>
      </div>
      <Green rel>Green</Green>
      </div>`,
  },
]
