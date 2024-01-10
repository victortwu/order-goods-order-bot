import { addItemsFromListToCart } from '../utils/addItemsFromListToCart';
import { itemList } from '../utils/itemList';

describe('Restaurant Depot Login Test', () => {
  it('Visits the login page and logs in', () => {
    const username = Cypress.env('USERNAME');
    const password = Cypress.env('PASSWORD');

    cy.visit(
      'https://member.restaurantdepot.com/customer/account/login#shipping'
    );

    cy.get('input[name="login[username]"]').as('username');
    cy.wait(1000);
    cy.get('@username').type(username);

    cy.get('input[name="login[password]"]').type(password);

    cy.get('button[type="submit"]').click();

    cy.wait(3000);

    cy.get('.popup-shopping-main').as('popup');
    cy.get('@popup').should('be.visible');
    cy.get('@popup').find('#delivery-popup').click();
    cy.wait(1000);
    cy.get('.delivery-zip-container').as('deliveryZip');
    cy.get('@deliveryZip').should('be.visible');
    cy.get('input[name="delivery_zip"]').as('zipcode').type('98109');
    cy.wait(1000);
    cy.get('@deliveryZip')
      .find('button')
      .should('have.text', 'Submit')
      .as('submit');
    cy.get('@submit').click();

    cy.wait(3000);
    cy.intercept(
      'GET',
      'https://member.restaurantdepot.com/catalogsearch/result/?q=*'
    ).as('searchResult');
    cy.get('input[id="search"]').as('search').should('be.visible');

    addItemsFromListToCart(itemList);
  });
});
