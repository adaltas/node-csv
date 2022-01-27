
const init_state = (options) => {
  // State
  return {
    start_time: options.duration ? Date.now() : null,
    fixed_size_buffer: '',
    count_written: 0,
    count_created: 0,
  };
};

export {init_state};
