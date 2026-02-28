// 修复 window 全局属性的类型声明
declare global {
  interface Window {
    __FUDO_I18N__?: import("./core").I18nCore;
  }
}

export {};
