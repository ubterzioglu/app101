import { DOCUMENT_CATEGORIES } from '@/constants/document-catalog';

describe('document catalog', () => {
  it('contains non-empty categories and document lists', () => {
    expect(DOCUMENT_CATEGORIES.length).toBeGreaterThan(0);
    for (const category of DOCUMENT_CATEGORIES) {
      expect(category.category.trim().length).toBeGreaterThan(0);
      expect(category.documents.length).toBeGreaterThan(0);
    }
  });

  it('keeps the required public fields for every document card', () => {
    for (const category of DOCUMENT_CATEGORIES) {
      for (const document of category.documents) {
        expect(document.name?.trim()).toBeTruthy();
        expect(document.officialName?.trim()).toBeTruthy();
        expect(document.purpose?.trim()).toBeTruthy();
        expect(document.who?.trim()).toBeTruthy();
        expect(document.supportingDocs?.trim()).toBeTruthy();
        expect(document.authority?.trim()).toBeTruthy();
        expect(document.duration?.trim()).toBeTruthy();
        expect(document.cost?.trim()).toBeTruthy();
      }
    }
  });
});
