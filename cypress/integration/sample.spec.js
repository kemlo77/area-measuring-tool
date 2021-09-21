describe('Drawing polygons', () => {

    beforeEach(() => {
        cy.visit('localhost:5600');
    });

    it('Drawing positive polygon - total area is displayed', () => {
        cy.get('button').contains('Add positive polygon').click();
        cy.get('#foreground').click(100, 100);
        cy.get('#foreground').click(200, 100);
        cy.get('#foreground').click(200, 200);
        cy.get('#foreground').click(100, 200);
        cy.get('#foreground').click(100, 100);
        cy.get('#foreground').click(1, 1);
        cy.get('div[id="data"]').should('contain.text', 'Area total: 101');
    });
});