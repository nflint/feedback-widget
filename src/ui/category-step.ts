import { h } from '../utils/dom';
import { icons } from '../utils/icons';
import type { FeedbackCategory } from '../types';

interface CategoryOption {
  value: FeedbackCategory;
  label: string;
  icon: string;
}

const categories: CategoryOption[] = [
  { value: 'bug', label: 'Bug', icon: icons.bug },
  { value: 'enhancement', label: 'Enhancement', icon: icons.enhancement },
  { value: 'question', label: 'Question', icon: icons.question },
  { value: 'other', label: 'Other', icon: icons.other },
];

export class CategoryStep {
  readonly el: HTMLDivElement;

  constructor(onSelect: (category: FeedbackCategory) => void) {
    const grid = h('div', { class: 'fw-categories' });

    for (const cat of categories) {
      const card = h('button', {
        class: 'fw-category-card',
        onClick: () => onSelect(cat.value),
      });
      card.innerHTML = cat.icon;
      card.appendChild(document.createTextNode(cat.label));
      grid.appendChild(card);
    }

    this.el = h('div', null, [
      h('p', { style: 'color:var(--fw-text-secondary);margin-bottom:14px;font-size:14px' }, 'What type of feedback do you have?'),
      grid,
    ]);
  }
}
