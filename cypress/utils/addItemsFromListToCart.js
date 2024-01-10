const searchAndAddItem = (searchTerm, itemName, quantity, isCase) => {
  cy.get('@search').type(`${searchTerm}{enter}`);
  cy.wait('@searchResult');
  cy.get('#hawkitemlist').as('hawkitemlist').should('be.visible');

  // if the item is not visible, return, do not fail the test

  cy.wait(2000);
  cy.get('@hawkitemlist').then(($list) => {
    cy.log('Found list: ', $list.find('h2'));
    console.log('Found list: ', $list.find('h2'));

    if (!$list.find(`li:contains(${itemName})`).length) {
      cy.log(`Item ${itemName} not found`);
      return;
    }

    cy.contains(itemName).should('be.visible').as('item');

    cy.get('@item')
      .parents('.custom-listing-table')
      .within(() => {
        // todo: Find the drop down menu and select the Unit or Case option
        cy.get('.select-div-box').then(($select) => {
          cy.log('Found select wrapper: ', $select.find('option').length);
          if ($select.find('option').length > 1) {
            if (isCase) {
              cy.get('select[aria-label="Size"]').select(2);
              cy.wait(1000);
            } else {
              cy.get('select[aria-label="Size"]').select(1);
              cy.wait(1000);
            }
          }
        });
        // Find the quantity input field and set its value to 2
        cy.get('.product-qty').clear().type(quantity); // Clear any existing value and type '2'

        // Click the "Add to Cart" button for this specific item
        cy.get('form[data-role="tocart-form"]').within(() => {
          cy.get('button[type="submit"]').click();
        });
      });
  });
};

export const addItemsFromListToCart = (itemList) => {
  itemList.forEach((item) => {
    searchAndAddItem(
      item.searchTerm,
      item.itemName,
      item.quantity,
      item.isCase
    );
  });
};
