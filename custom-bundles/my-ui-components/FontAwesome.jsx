const styles = {
  solid: "fas",
  regular: "far",
  light: "fal",
  brands: "fab",
};

export default ({icon="font-awesome", iconStyle="solid", ...props}) => {
  console.assert(styles[iconStyle], "Unknown FontAwesome iconStyle: "+iconStyle);

  return (<i className={`${styles[iconStyle]} fa-${icon}`} {...props}></i>);
}

