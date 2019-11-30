// https://stackoverflow.com/a/50731217/2024590
function buttonize(handlerFn) {
  return {
    role: 'button',
    onClick: handlerFn,
    onKeyDown: (event) => {
      if (event.keycode === 13) handlerFn(event);
    },
  };
}
export default buttonize;
