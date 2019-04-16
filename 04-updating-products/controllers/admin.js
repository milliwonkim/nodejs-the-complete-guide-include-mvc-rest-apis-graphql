const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  })
    .then(result => {
      // console.log(result);
      console.log('Created Product');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  /**let's handle any error by logging them for now
   * and in then, let's work with the product we retrieved
   * that product now needs to be updated
   *
   * we can simply do that by saying 'product.title = updatedTitle'
   * so we can work with all the attributes our product has per our model definition and change them
   * note that this will not directly change the data in the database,
   * it will only do it locally in our app in our javascript app for the moment.
   *
   */
  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      /**as i said, this will not directly edit it in the database
       * to do that, we have to call 'product.save()'
       * this is another method provided by sequelize
       * those takes the product as we edit it and save it back to the database.
       *
       * if the product doesn't exist yet,
       * it will create a new one,
       * if it does as this one,
       * then it will overwrite or update the old one with our new values.
       * 
       * we can again chain then and catch
       * but to not start nesting our promises 
       * which would yield the same ugly picture as nesting callbacks,
       * we can 'return' this,
       * so we return the promise which is returned by 'save()'
       * and we can add 'then()' block below.
       */
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    /**this 'catch()' block would catch errors both for this first '.then()' and second '.then()' 
     * the second 'then()' block will handle any success response from this 'save()' promise
     * 
    */
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};
