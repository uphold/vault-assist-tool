import { css } from 'styled-components';
import { styles } from '.';

export const tippy = css`
  .tippy-box[data-theme~='alert'],
  .tippy-box[data-theme~='default'],
  .tippy-box[data-theme~='info'],
  .tippy-box[data-theme~='navigation'],
  .tippy-box[data-theme~='success'] {
    box-shadow: 0px 8px 16px 0px rgba(132, 148, 165, 0.2);
    font-family: 'Metropolis';
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.4px;
    line-height: 16px;
    padding: 4px 8px;
  }

  .tippy-box[data-theme~='alert'] .tippy-content,
  .tippy-box[data-theme~='default'] .tippy-content,
  .tippy-box[data-theme~='info'] .tippy-content,
  .tippy-box[data-theme~='navigation'] .tippy-content,
  .tippy-box[data-theme~='success'] .tippy-content {
    padding: 0;
  }

  .tippy-box[data-theme~='alert'] {
    background-color: ${styles.Utils.getColorWithOpacity(styles.colors.n06, 0.9)};
    color: ${styles.colors.n01};
    color: ${styles.colors.n01};
    font-weight: normal;
    padding: 16px;
  }

  .tippy-box[data-placement^='top'][data-theme~='alert'] .tippy-arrow::before {
    border-top-color: ${styles.Utils.getColorWithOpacity(styles.colors.n06, 0.9)};
  }

  .tippy-box[data-placement^='bottom'][data-theme~='alert'] .tippy-arrow::before {
    border-bottom-color: ${styles.Utils.getColorWithOpacity(styles.colors.n06, 0.9)};
  }

  .tippy-box[data-placement^='left'][data-theme~='alert'] .tippy-arrow::before {
    border-left-color: ${styles.Utils.getColorWithOpacity(styles.colors.n06, 0.9)};
  }

  .tippy-box[data-placement^='right'][data-theme~='alert'] .tippy-arrow::before {
    border-right-color: ${styles.Utils.getColorWithOpacity(styles.colors.n06, 0.9)};
  }

  .tippy-box[data-theme~='default'] {
    background-color: ${styles.Utils.getColorWithOpacity(styles.colors.n07, 0.8)};
    color: ${styles.Utils.getColorWithOpacity(styles.colors.n01, 0.56)};
  }

  .tippy-box[data-placement^='top'][data-theme~='default'] .tippy-arrow::before {
    border-top-color: ${styles.Utils.getColorWithOpacity(styles.colors.n07, 0.8)};
  }

  .tippy-box[data-placement^='bottom'][data-theme~='default'] .tippy-arrow::before {
    border-bottom-color: ${styles.Utils.getColorWithOpacity(styles.colors.n07, 0.8)};
  }

  .tippy-box[data-placement^='left'][data-theme~='default'] .tippy-arrow::before {
    border-left-color: ${styles.Utils.getColorWithOpacity(styles.colors.n07, 0.8)};
  }

  .tippy-box[data-placement^='right'][data-theme~='default'] .tippy-arrow::before {
    border-right-color: ${styles.Utils.getColorWithOpacity(styles.colors.n07, 0.8)};
  }

  .tippy-box[data-theme~='info'] {
    background-color: ${styles.colors.i06};
    padding: 8px 16px;
  }

  .tippy-box[data-placement^='top'][data-theme~='info'] .tippy-arrow::before {
    border-top-color: ${styles.colors.i06};
  }

  .tippy-box[data-placement^='bottom'][data-theme~='info'] .tippy-arrow::before {
    border-bottom-color: ${styles.colors.i06};
  }

  .tippy-box[data-placement^='left'][data-theme~='info'] .tippy-arrow::before {
    border-left-color: ${styles.colors.i06};
  }

  .tippy-box[data-placement^='right'][data-theme~='info'] .tippy-arrow::before {
    border-right-color: ${styles.colors.i06};
  }

  .tippy-box[data-theme~='navigation'] {
    background-color: ${styles.Utils.getColorWithOpacity(styles.colors.n06, 0.9)};
    box-shadow: none;
    color: ${styles.colors.n01};
    font-weight: normal;
    padding: 6px 8px;
  }

  .tippy-box[data-theme~='navigation'] .disabled {
    color: ${styles.Utils.getColorWithOpacity(styles.colors.n01, 0.56)};
  }

  .tippy-box[data-theme~='success'] {
    background-color: ${styles.colors.p06};
    color: ${styles.colors.n01};
  }

  .tippy-box[data-placement^='top'][data-theme~='success'] .tippy-arrow::before {
    border-top-color: ${styles.colors.p06};
  }

  .tippy-box[data-placement^='bottom'][data-theme~='success'] .tippy-arrow::before {
    border-bottom-color: ${styles.colors.p06};
  }

  .tippy-box[data-placement^='left'][data-theme~='success'] .tippy-arrow::before {
    border-left-color: ${styles.colors.p06};
  }

  .tippy-box[data-placement^='right'][data-theme~='success'] .tippy-arrow::before {
    border-right-color: ${styles.colors.p06};
  }
`;
