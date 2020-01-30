RetailRocket static content project.


Integration
===
Retai Rocket tracking code consists of 6 small code snippets that need to be placed on your website.
Place this code on your site:
1. Main tracking code
Place this piece of code on each page of your website in the <head> section:
```
<script type="text/javascript">
      var rrPartnerId = "<Your_PartnerId>";       
      var rrApi = {}; 
      var rrApiOnReady = rrApiOnReady || [];
      rrApi.addToBasket = rrApi.order = rrApi.categoryView = rrApi.view = 
          rrApi.recomMouseDown = rrApi.recomAddToCart = function() {};
      (function(d) {
          var ref = d.getElementsByTagName('script')[0];
          var apiJs, apiJsId = 'rrApi-jssdk';
          if (d.getElementById(apiJsId)) return;
          apiJs = d.createElement('script');
          apiJs.id = apiJsId;
          apiJs.async = true;
          apiJs.src = "//cdn.retailrocket.net/content/javascript/tracking.js";
          ref.parentNode.insertBefore(apiJs, ref);
      }(document));
</script>
```
       
2. Product page tracker
Place this code on each product details page and quick view forms:
```
<script type="text/javascript">
     (window["rrApiOnReady"] = window["rrApiOnReady"] || []).push(function() {
        // Send product data
        retailrocket.products.post({
            // Product ID, number without quotes
            "id": <product ID>,
            // Product name, string
            "name": "Example product name",
            // Product price, number without quotes
            "price": 15.95,
            // URL of an image of the item, maximum 250KB. Preferred image width 200-300px.
            "pictureUrl": "http://example.com/path/to/Photo.jpg",
            "url": "http://www.example.com/path/to/productPage",
            // Product availability status, true or false
            "isAvailable": true,
            // Array of product category name paths with a slash as category level separator.
            // Category path must exactly reflect your website menu structure and categories nesting
            // (please use static category names only, no URL paths, sidebar filters or dynamic
            // breadcrumbs are allowed). Specify only lowest level (if the product is listed
            // in categories "Women/Clothes/Skirts" and "Women/Clothes/" you should only pass
            // "Women/Clothes/Skirts")
            "categoryPaths": ["Women/Clothes/Skirts","Women/New Arrivals"],
            // Product's description
            "description": "Some text description",
            // Product Vendor (e.g. HP)
            "vendor": "Brand name",
            // Product model (e.g. LaserJet 3500), optional parameter
            "model": "Model name",
            // Product type (e.g. Laser Printer), optional parameter
            "typePrefix": "Product type",
            // Old price, used to indicate products on sale, optional parameter
            "oldPrice": 17.46,
            // Product additional information, optional parameter
            "params": {
                    "<custom parameter 1 name>":  "<custom parameter 1 value>",
                    "<custom parameter 2 name>":  "<custom parameter 2 value>",
                    "<custom parameter N name>":  "<custom parameter N value>"
               }
        });
        // Product ID, number without quotes
        rrApi.view(<product ID>);
    });
</script>
```
Field params contains custom fields which will be available on the website recommendation display or in emails.

3. Category page tracker
Place this code on each category page:
```
<script type="text/javascript">
    (window["rrApiOnReady"] = window["rrApiOnReady"] || []).push(function() {
        // Full path to current category with slash as a separator, string. It must match the path transmitted in product pages in this category.      
        rrApi.categoryView("Women/Clothes/Skirts");
    });
</script>
```

4. Add to cart tracker
Insert this code as an onMouseDown attribute in the code of all the buttons that add a product to a cart:
```onmousedown="try { rrApi.addToBasket(<product_id>) } catch(e) {}"```
Where, <product_id> is a numeric ID of the product.
For example:
```<div class="buy_button" onmousedown="try { rrApi.addToBasket(123) } catch(e) {}"></div>```
Note: Add to cart buttons may be used not only on the product pages, but on the category pages or internal search results pages as well. Add to cart tracker must be installed there too.

5. Transaction tracker
Place this code on a "Thank you" page. This tracker should work with all payments and delivery methods, 1-click order forms. 
```
<script type="text/javascript">
(window["rrApiOnReady"] = window["rrApiOnReady"] || []).push(function() {
    try {
        rrApi.order({
            "transaction": "<transaction_id>",
            "items": [
                { "id": <product_id>, "qnt": <quantity>,  "price": <price>},
                { "id": <product_id>, "qnt": <quantity>,  "price": <price> }
            ]
        });
    } catch(e) {}
})
</script>
```
Where: 
<transaction_id> is an ID of the transaction (string),
<product_id> is a numeric product ID,
<qnt> is a quantity of the products bought,
<price> is a price per one product.
Example:
```
<script type="text/javascript">
(window["rrApiOnReady"] = window["rrApiOnReady"] || []).push(function() {
	try {
      rrApi.order({
         "transaction": "1235421421",
         "items": [
            { "id": 12312, "qnt": 4, "price": 130 },
            { "id": 64532, "qnt": 1, "price": 220 }
         ]
      });
	} catch(e) {}
})
</script>
```

6. Email tracking code
Every time you have your visitor's email, run a code:
```
(window["rrApiOnReady"] = window["rrApiOnReady"] || []).push(function() { rrApi.setEmail("<user_email>"); });
```
Important: you can only use an email of a person, who clearly expressed his or her desire to receive email messages from your company, including email advertising campaigns.
Example 1: add the following attribute to the "Submit" button of sign-up forms that are used across your website: 
```
onclick="try {rrApi.setEmail($('#EmailFieldID').val());}catch(e){}"
```
Example 2:  add the following code to the "Thank you" page if a user subscribed to your newsletter during checkout process: 
```
<script type="text/javascript"> (window["rrApiOnReady"] = window["rrApiOnReady"] || []).push(function() { rrApi.setEmail("<user_email>"); }); </script>
```
Example 3: additional user data for email personalization: 
```
<script type="text/javascript"> (window["rrApiOnReady"] = window["rrApiOnReady"] || []).push(function() { rrApi.setEmail("example@email.com", { "gender": "Male", "age": 21, "birthday": "15.01.1983" }); }); </script>
```
Recommended data to use:
gender (string),
age (number, without quotes),
name (first name only, string),
birthday (string, DD.MM.YYYY format).
More information about data transferring you can find here https://my.retailrocket.net/Trackers/SetEmail.

More information about integration https://manual.retailrocket.net/


Api
===

1. Recommendations

- Products
```
retailrocket.recommendation.forProducts(
   // string
   partnerId,
   // array
   itemIds,
   //string <alternative, related, accessories>
   algorithm,
   // json like {stock:""},
   params,   
   // function for work with array of recommendations
   callback)
   ```

- Categories
```
retailrocket.recommendation.forCategories(
   // string
   partnerId,
   // ARRAY OF CATEGORY IDS or 0 for whole shop
   categoryIds,
   //string <latest, popular>
   algorithm,
   // json like {stock:""},
   params,
   // function for work with array of recommendations
   callback)
   ```

- Personal
```
retailrocket.recommendation.forPerson(
   partnerId,
   sessionId,
   deletedParam,
   algorithm,
   params,
   callaback)
   ```

- Visitor
```
retailrocket.recommendation.forVisitor(
   partnerId,
   sessionId,
   params,
   callaback)
   ```
   
- Search
```
retailrocket.recommendation.forSearch(
   partnerId,
   // string
   phrase,
   params,
   callaback)
   ```
   
- VisitorCategoryInterest
```
retailrocket.recommendation.forVisitorCategoryInterest(
   partnerId,
   sessionId,
   algorithm,
   params,
   callaback)
   ```

- Preview
```
retailrocket.recommendation.forPreview(
   partnerId,
   callaback)
```


Example:

- Personal
```
(window["rrApiOnReady"] = window["rrApiOnReady"] || []).push(
 function() {
   retailrocket.recommendation.forPerson(
     retailrocket.api.getPartnerId(),
     retailrocket.api.getSessionId(),
     "",
     "personal",
     {},
     function (recommendation) {
       console.log(recommendation);
     }
   );
 }
);
```

- Search
```
(window["rrApiOnReady"] = window["rrApiOnReady"] || []).push(
 function() {
   retailrocket.recommendation.forSearch(
     retailrocket.api.getPartnerId(),
     "<keyword>",
     {},
     function (recommendation) {
       console.log(recommendation);
     }
   );
 }
);
```


2. Api.js

To get partnerId:
```
retailrocket.api.getPartnerId();
```
To get RetailRocket session id of current user:
```
retailrocket.api.getSessionId();
```
To get partner visitor id of current user:
```
retailrocket.api.getPartnerVisitorId();
```
To call RetailRocket API tracking when all is loaded:
```
retailrocket.api.pushTrackingCall(rrTrackingFunction);
```

3. Products

For post product data:
```
retailrocket.products.post({
            // Product ID, number without quotes
            "id": <product ID>,
            // Product name, string
            "name": "Example product name",
            // Product price, number without quotes
            "price": 15.95,
            // URL of an image of the item, maximum 250KB. Preferred image width 200-300px.
            "pictureUrl": "http://example.com/path/to/Photo.jpg",
            "url": "http://www.example.com/path/to/productPage",
            // Product availability status, true or false
            "isAvailable": true,
            // Array of product category name paths with a slash as category level separator.
            // Category path must exactly reflect your website menu structure and categories nesting
            // (please use static category names only, no URL paths, sidebar filters or dynamic
            // breadcrumbs are allowed). Specify only lowest level (if the product is listed
            // in categories "Women/Clothes/Skirts" and "Women/Clothes/" you should only pass
            // "Women/Clothes/Skirts")
            "categoryPaths": ["Women/Clothes/Skirts","Women/New Arrivals"],
            // Product's description
            "description": "Some text description",
            // Product Vendor (e.g. HP)
            "vendor": "Brand name",
            // Product model (e.g. LaserJet 3500), optional parameter
            "model": "Model name",
            // Product type (e.g. Laser Printer), optional parameter
            "typePrefix": "Product type",
            // Old price, used to indicate products on sale, optional parameter
            "oldPrice": 17.46,
            // Product additional information, optional parameter
            "params": {
                    "<custom parameter 1 name>":  "<custom parameter 1 value>",
                    "<custom parameter 2 name>":  "<custom parameter 2 value>",
                    "<custom parameter N name>":  "<custom parameter N value>"
               }
        });
```


4. Categories
```
retailrocket.categories.post(
   {
   // int64
   “Id”: <categoryId>,
   // string
   “CategoryPath”: “ParentCategory/CurrentCategory”,
   // string, required
   “Uri”: “https://mysite.com/category/CurrentCategory”
   });
```
Id or CategoryPath must be set.


5. Visitor

To get some data about user by session:
```
   bool HasEmail
   bool IsAgreedToReceiveMarketingMail
```

```
retailrocket.visitor.get(
   partnerId,
   sessionId,
   callback,
   errback)
```

To save email and customData of user.
```
retailrocket.visitor.post(
   Body: {Email, Data, IsAgreedToReceiveMarketingMail},
   Signature: {secret key}
   Callback,
   errback)
```

Patch same as post

6. Items
```
retailrocket.items.get(
   partnerId,
   // array of product ids
   productIds,
   callback
);
```
