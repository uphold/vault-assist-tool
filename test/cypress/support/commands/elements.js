import { validate as uuidValidate } from 'uuid';
import I18n from '../../translations';

const stringToArray = id => {
  if (typeof id === 'string') {
    return [id];
  }

  return id;
};

Cypress.Commands.add('checkDisabled', (id, index = 0) => {
  const list = stringToArray(id);

  list.forEach(element => {
    cy.findAllByTestId(element).eq(index).should('be.disabled');
  });
});

Cypress.Commands.add('checkHref', (id, route) => {
  cy.findAllByTestId(id).first().should('have.attr', 'href').and('include', route);
});

Cypress.Commands.add('checkExist', id => {
  const list = stringToArray(id);

  list.forEach(element => {
    cy.findByTestId(element).should('exist');
  });
});

Cypress.Commands.add('checkNotExist', id => {
  const list = stringToArray(id);

  list.forEach(element => {
    cy.findByTestId(element).should('not.exist');
  });
});

Cypress.Commands.add('checkNotExistText', text => {
  const list = stringToArray(text);

  list.forEach(element => {
    cy.findByText(element).should('not.exist');
  });
});

Cypress.Commands.add('checkRoute', (route, options) => {
  cy.location('pathname', options).should('be.equal', route);
});

Cypress.Commands.add('checkText', (id, text, index = 0) => {
  cy.findAllByTestId(id).eq(index).scrollIntoView();
  cy.findAllByTestId(id).eq(index).should('include.text', text);
});

Cypress.Commands.add('checkHaveText', (id, text, index = 0) => {
  cy.findAllByTestId(id).eq(index).scrollIntoView();
  cy.findAllByTestId(id).eq(index).should('have.text', text);
});

Cypress.Commands.add('checkValue', (id, value, index = 0) => {
  cy.findAllByTestId(id).eq(index).should('have.value', value);
});

Cypress.Commands.add('checkVisible', (id, type, index = 0) => {
  const list = stringToArray(id);

  list.forEach(element => {
    cy.findAllByTestId(element).eq(index).scrollIntoView();
    cy.findAllByTestId(element).eq(index).should('be.visible');

    if (type === 'string') {
      cy.hasText(element);
    }
  });
});

Cypress.Commands.add('checkVisibleText', (text, index = 0) => {
  const list = stringToArray(text);

  list.forEach(element => {
    cy.findAllByText(element).eq(index).scrollIntoView();
    cy.findAllByText(element).eq(index).should('be.visible');
  });
});

Cypress.Commands.add('checkVisibleAll', id => {
  cy.findAllByTestId(id).each(item => {
    cy.get(item).scrollIntoView();
    cy.get(item).should('be.visible');
  });
});

Cypress.Commands.add('checkVisibleAndContains', (id, value, options) => {
  cy.findAllByTestId(id).first().scrollIntoView();
  cy.findAllByTestId(id).first().should('be.visible').contains(value, options);
});

Cypress.Commands.add('checkVisibleIFrameId', id => {
  cy.get(`iframe#${id}`).should('be.visible');
});

Cypress.Commands.add('clearAndCheck', id => {
  const list = stringToArray(id);

  list.forEach(element => {
    cy.findByTestId(element).clear();

    cy.findByTestId(element).should('have.value', '');
  });
});

Cypress.Commands.add('checkContains', (text, options) => {
  const list = stringToArray(text);

  list.forEach(element => {
    cy.contains(element, options);
  });
});

Cypress.Commands.add('containAndVisible', (id, options) => {
  const list = stringToArray(id);

  list.forEach(element => {
    cy.contains(element, options).scrollIntoView();
    cy.contains(element, options).should('be.visible');
  });
});

Cypress.Commands.add('findAndClick', (id, index = 0, options) => {
  const list = stringToArray(id);

  list.forEach(element => {
    cy.findAllByTestId(element).eq(index).scrollIntoView();
    cy.findAllByTestId(element).eq(index).click(options);
  });
});

Cypress.Commands.add('findByTextAndClick', (id, options, index = 0) => {
  cy.findAllByText(id).eq(index).click(options);
});

Cypress.Commands.add('findIcon', (element, id) => {
  cy.get(element).scrollIntoView();
  cy.get(element).find(id).should('be.visible');
});

Cypress.Commands.add('getAttr', (id, attr, alias, index = 0) => {
  cy.findAllByTestId(id)
    .eq(index)
    .invoke('attr', attr)
    .then(attr => {
      cy.wrap(attr).as(alias);
    });
});

Cypress.Commands.add('getText', (id, alias, index = 0) => {
  cy.findAllByTestId(id)
    .eq(index)
    .invoke('text')
    .then(value => {
      cy.wrap(value).as(alias);
    });
});

Cypress.Commands.add('hasText', (id, index = 0) => {
  cy.findAllByTestId(id).eq(index).scrollIntoView();
  cy.findAllByTestId(id)
    .eq(index)
    .invoke('text')
    .then(text => {
      expect(text).to.have.lengthOf.gt(0);
    });
});

Cypress.Commands.add('getElementReferencedByAttr', { prevSubject: true }, (subject, attr) => {
  cy.wrap(subject)
    .should('have.attr', attr)
    .then(attr => {
      cy.get(`#${attr}`);
    });
});

Cypress.Commands.add('typeAndCheck', (id, value, options) => {
  if (value !== '') {
    cy.findByTestId(id).as('input');

    cy.get('@input').clear({ force: true });
    cy.get('@input').should('be.empty');
    cy.get('@input').type(value, options);

    return cy.get('@input').should('have.value', value);
  }

  cy.findAllByTestId(id).first().scrollIntoView();

  return cy.findAllByTestId(id).first().invoke('val', '');
});

Cypress.Commands.add('checkTitleAndSubtitle', (title, subtitle, index = 0) => {
  cy.checkText('navigationTitle', title, index);

  if (subtitle) {
    cy.checkText('navigationSubtitle', subtitle, index);
  }
});

Cypress.Commands.add('checkNoResults', () => {
  cy.checkText('noResultsDescription', I18n.t('list.noResults.description'));
  cy.checkText('noResultsTitle', I18n.t('list.noResults.title'));
});

Cypress.Commands.add('validateText', id => {
  cy.findByTestId(id).scrollIntoView();
  cy.findByTestId(id).then(element => expect(uuidValidate(element.text())).to.be.true);
});

Cypress.Commands.add('checkContainsUrl', (id, alias) => {
  const isValidHttpUrl = url => {
    try {
      url = new URL(url);
    } catch {
      return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
  };

  cy.getText(id, alias).then(text => {
    cy.wrap(isValidHttpUrl(text)).should('be.true');
  });
});

Cypress.Commands.add('checkUrl', url => {
  cy.url().should('include', url);
});

Cypress.Commands.add('checkListOfTextFields', (translationsPath, fields) => {
  fields.forEach(field => {
    cy.checkVisibleText(I18n.t(`${translationsPath}.${field}`));
  });
});
