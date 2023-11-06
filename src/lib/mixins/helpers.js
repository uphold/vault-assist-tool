const isPropFromMixin = (mixins, prop) => mixins.propNames.includes(prop);

const filterOutProps = (mixins, props) =>
  Object.keys(props).reduce((filtered, key) => {
    if (!isPropFromMixin(mixins, key)) {
      filtered[key] = props[key];
    }

    return filtered;
  }, []);

const filterInProps = (mixins, props) =>
  Object.keys(props).reduce((filtered, key) => {
    if (isPropFromMixin(mixins, key)) {
      filtered[key] = props[key];
    }

    return filtered;
  }, []);

export default { filterInProps, filterOutProps, isPropFromMixin };
