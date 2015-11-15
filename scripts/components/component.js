import omniscient from 'omniscient';

const component = omniscient.withDefaults({
  isIgnorable: (_, key) => key == 'dispatch'
});

component.debug();

export default component;
