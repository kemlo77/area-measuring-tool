/* eslint-disable @typescript-eslint/explicit-function-return-type */
describe('Drawing polygons', () => {

  beforeEach(() => {
    cy.visit('localhost:5600');
  });

  it('Drawing positive polygon - total area is displayed', () => {
    drawPositiveSquare();
    cy.get('div[id="data"]').should('contain.text', 'Area total: 100');
    cy.get('div[id="data"]').find('div').should('have.length', 1);
  });


  it('Drawing negative polygon - total area is displayed', () => {
    drawNegativeSquare();
    cy.get('div[id="data"]').should('contain.text', 'Area total: -64');
    cy.get('div[id="data"]').find('div').should('have.length', 1);
  });

  it('Drawing a ruler - length is displayed', () => {
    drawRuler();
    cy.get('div[id="data"]').should('contain.text', 'Area total: 0');
    cy.get('div[id="data"]').find('div').should('have.length', 1);
  });

  it('Four different shapes - ', () => {
    drawPositiveSquare();
    drawNegativeSquare();
    drawRuler();
    drawSymmetryLine();

    cy.get('div[id="data"]').should('contain.text', 'Area total: 36');
    cy.get('div[id="data"]').find('div').should('have.length', 4);
  });

  it('draw a shape and remove it', () => {
    drawPositiveSquare();
    cy.get('#movementLayer').click(100, 100);
    cy.get('button').contains('Remove selected shape').click();
    cy.get('div[id="data"]').should('contain.text', 'Area total: 0');
    cy.get('div[id="data"]').find('div').should('have.length', 0);
  });

  function drawPositiveSquare(): void {
    cy.get('button').contains('Add positive polygon').click();
    cy.get('#movementLayer').click(100, 100);
    cy.get('#movementLayer').click(200, 100);
    cy.get('#movementLayer').click(200, 200);
    cy.get('#movementLayer').click(100, 200);
    cy.get('#movementLayer').click(100, 100);
    cy.get('#movementLayer').click(1, 1);
  }

  function drawNegativeSquare(): void {
    cy.get('button').contains('Add negative polygon').click();
    cy.get('#movementLayer').click(110, 110);
    cy.get('#movementLayer').click(190, 110);
    cy.get('#movementLayer').click(190, 190);
    cy.get('#movementLayer').click(110, 190);
    cy.get('#movementLayer').click(110, 110);
    cy.get('#movementLayer').click(1, 1);
  }

  function drawRuler(): void {
    cy.get('button').contains('Add ruler').click();
    cy.get('#movementLayer').click(100, 90);
    cy.get('#movementLayer').click(200, 90);
    cy.get('#movementLayer').click(1, 1);
  }

  function drawSymmetryLine(): void {
    cy.get('button').contains('Add symmetry line').click();
    cy.get('#movementLayer').click(100, 80);
    cy.get('#movementLayer').click(200, 80);
    cy.get('#movementLayer').click(1, 1);
  }


});