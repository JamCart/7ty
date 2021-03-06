describe('Save', () => {
  it('Visit', () => {
    cy.visit('/')

    cy.contains('Macaroons').click()
    cy.contains('button', 'Save').click()
    cy.contains('1 Item Saved')

    cy.visit('/')
    cy.contains('1 Item Saved')
  })
})
