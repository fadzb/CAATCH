import React from 'react';
import { View, Switch, Text } from 'react-native';

export const CheckBox = (locals) => {
  if (locals.hidden) {
    return null;
  }

  let stylesheet = locals.stylesheet;
  let formGroupStyle = stylesheet.formGroup.normal;
  let controlLabelStyle = stylesheet.controlLabel.normal;
  let checkboxStyle = stylesheet.checkbox.normal;
  let helpBlockStyle = stylesheet.helpBlock.normal;
  let errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    checkboxStyle = stylesheet.checkbox.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  let label = locals.label ? (
    <Text style={{ fontSize: 17, fontWeight: 'normal', color: '#cccccc' }}>{locals.label}</Text>
  ) : null;
  let help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
  let error =
    locals.hasError && locals.error ? (
      <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
        {locals.error}
      </Text>
    ) : null;

  return (
    <View style={formGroupStyle}>
      <View
        style={{
          paddingHorizontal: 7,
          borderRadius: 4,
          marginBottom: 4,
          borderColor: '#cccccc',
          borderWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 5,
          justifyContent: 'space-between',
        }}
      >
        {label}
        <Switch
          accessibilityLabel={locals.label}
          ref="input"
          disabled={locals.disabled}
          //onTintColor={locals.onTintColor || 'rgba(13,113,187,.5)'}
          //thumbTintColor={locals.thumbTintColor || (locals.value ? 'rgba(13,113,187,.9)' : '#eee')}
          //tintColor={locals.tintColor}
          //style={{flex:1, ...checkboxStyle}}
          onValueChange={(value) => locals.onChange(value)}
          value={locals.value}
        />
      </View>
      {help}
      {error}
    </View>
  );
};
