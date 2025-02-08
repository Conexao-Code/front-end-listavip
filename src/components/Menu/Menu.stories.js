import { Menu } from ".";

export default {
  title: "Components/Menu",
  component: Menu,
  argTypes: {
    property1: {
      options: ["logado-tema-escuro", "escuro", "claro"],
      control: { type: "select" },
    },
  },
};

export const Default = {
  args: {
    property1: "logado-tema-escuro",
    className: {},
    divClassName: {},
    divClassNameOverride: {},
    divClassName1: {},
    divClassName2: {},
    divClassName3: {},
    tema: "/img/tema-1.svg",
    botEsClassName: {},
    botODivClassName: {},
    botOPropertyDefaultClassName: {},
    botOPropertyDefaultClassNameOverride: {},
  },
};
