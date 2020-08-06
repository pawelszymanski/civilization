import {Ui} from '../../../../models/ui/ui';

import {UiStore} from '../../../../stores/ui.store';

export class ResearchTreeAbstractComponent {

  ui: Ui;

  protected constructor(
    private uiStore: UiStore
  ) {}

  onCloseButtonClick() {
    this.uiStore.closeModal();
  }

}
