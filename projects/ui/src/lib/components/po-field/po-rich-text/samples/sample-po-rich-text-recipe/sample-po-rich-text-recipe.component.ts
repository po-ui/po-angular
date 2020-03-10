import { Component } from '@angular/core';
import image from './sample-po-rich-text-recipe-image-base-64';

@Component({
  selector: 'sample-po-rich-text-recipe',
  templateUrl: './sample-po-rich-text-recipe.component.html'
})
export class SamplePoRichTextRecipeComponent {
  recipe = `
    <div style="text-align: center;"><b>Quick Hummus Recipe</b></div>
    <div><br></div>
    <div style="text-align: start;">
    <div><b><u>Preparation Time:</u></b>&nbsp;less than 30 mins</div>
    <div><b><u>Serves</u></b>: 3 people</div>
    <div><b><u>Reference</u></b>:
      <a class="po-rich-text-link" href="http://en.wikipedia.org/wiki/hummus" target="_blank">Hummus Delicious Recipe</a>
    </div>
    </div>
    <div><br></div>
    <img src="${image}">
    <div style="text-align: start;"><br></div>
    <div style="text-align: start;"><u><b>Ingredients</b></u>&nbsp;<br></div>
    <div style="text-align: start;"><u><br></u></div>
    <div style="text-align: start;">
      <ul>
        <li><i>200g/7oz</i>&nbsp;canned&nbsp;<b>chickpeas</b></li>
        <li><i>2</i>&nbsp;<i>tbsp</i>&nbsp;<b>lemon juice</b>&nbsp;or more</li>
        <li><i>2</i>&nbsp;<b>garlic</b>&nbsp;cloves, crushed</li>
        <li><i>1</i>&nbsp;<i>tsp</i>&nbsp;ground&nbsp;<b>cumin&nbsp;</b></li>
        <li><i>pinch</i>&nbsp;<b>salt</b></li>
        <li><i>1</i>&nbsp;<i>tbsp</i>&nbsp;<b>tahini</b>&nbsp;(sesame seed paste)</li>
        <li><i>4</i>&nbsp;<i>tbsp</i>&nbsp;<b>water</b></li>
        <li><i>2</i>&nbsp;<i>tbsp</i>&nbsp;extra virgin&nbsp;<b>olive oil</b></li>
        <li><i>1</i>&nbsp;<i>tsp</i>&nbsp;<b>paprika</b></li>
        <li><i>4&nbsp;rounds</i>&nbsp;of&nbsp;<b>pitta bread</b></li>
      </ul>
    </div>
    <div style="text-align: justify;"><b><br></b></div>
    <div style="text-align: start;">
      <div style="text-align: justify;">
        <b>1.&nbsp;</b>Drain the chickpeas and rinse. Reserve a few whole chick peas for serving.
      </div>
      <div style="text-align: justify;"><br></div>
      <div style="text-align: justify;">
        <b>2.</b>&nbsp;Combine the chickpeas, lemon juice, garlic, cumin, salt, tahini, and water in a food processor,
        and blend to a creamy purée.
      </div>
      <div style="text-align: justify;"><br></div>
      <div style="text-align: justify;">
        <b>3.&nbsp;</b>Add more lemon juice, garlic, cumin or salt to taste. Turn out into a dinner plate, and make
        smooth with the back of a spoon. Drizzle with extra virgin olive oil and scatter with the reserved chickpeas.
      </div>
      <div style="text-align: justify;"><br></div>
      <div style="text-align: justify;">
        <b>4.&nbsp;</b>Sprinkle with paprika and serve with pita bread, warmed in a moderate
        oven for three minutes, and cut into quarters.
      </div>
    </div>`;
}
