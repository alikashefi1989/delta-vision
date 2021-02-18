import React from 'react';
import { Input, IProps as IProps_Input } from '../Input/Input';
import { Number, IProps as IProps_Number } from '../Number/Number';
import { Textarea, IProps as IProps_Textarea } from '../Textarea/Textarea';
import { Select, IProps as IProps_Select } from '../Select/Select';
import { CheckBox, IProps as IProps_CheckBox } from '../CheckBox/CheckBox';
import {
    RangeSlider,
    IProps as IProps_RangeSlider,
} from '../RangeSlider/RangeSlider';
import { Slider, IProps as IProps_SLider } from '../Slider/Slider';
import {
    RadioButton,
    IProps as IProps_RadioButton,
} from '../RadioButton/RadioButton';
import {
    AsyncSelect,
    IProps as IProps_AsyncSelect,
} from '../AsyncSelect/AsyncSelect';
import {
    MultiLangInput,
    IProps as IProps_MultiLangInput,
} from '../MultiLangInput/MultiLangInput';
import {
    MultiLangTextarea,
    IProps as IProps_MultiLangTextarea,
} from '../MultiLangTextarea/MultiLangTextarea';
import { FileInput, IProps as IProps_FileInput } from '../FileInput/FileInput';
import {
    MultiFileInput,
    IProps as IProps_MultiFileInput,
} from '../MultiFileInput/MultiFileInput';
import {
    MultiLangInputList,
    IProps as IProps_MultiLangInputList,
} from '../MultiLangInputList/MultiLangInputList';
import { TagSelect, IProps as IProps_TagSelect } from '../TagSelect/TagSelect';
import { AppMap, IProps as IProps_Map } from '../Map/Map';
import { IProps as IProps_ZohoLookup, ZohoLookup } from '../Lookup/ZohoLookup';
import { PhoneList, IProps as IProps_PhoneList } from '../PhoneList/PhoneList';
import {
    AttributeInput,
    IProps as IProps_Attribute,
} from '../AttributeInput/AttributeInput';
import {
    DateTimePicker,
    IProps as IProps_DateTimePicker,
} from '../DateTimePicker/DateTimePicker';
import { ZohoInput, IProps as IProps_Input_Zoho } from '../Input/zohoInput';
import {
    ZohoMultiLangInput,
    IProps as IProps_MultiLangInput_Zoho,
} from '../MultiLangInput/zohoMultiLangInput';
// import { ThemeInputSelect, IProps as IProps_Select_Theme } from '../Theme/Select/Select';
import {
    ZohoInputAsyncSelect,
    IProps as IProps_AsyncSelect_Zoho,
} from '../AsyncSelect/zohoAsyncSelect';
import {
    ZohoDateTimePicker,
    IProps as IProps_DateTimePicker_Zoho,
} from '../DateTimePicker/zohoDateTimePicker';
import {
    ZohoTextarea,
    IProps as IProps_Textarea_Zoho,
} from '../Textarea/zohoTextarea';
import {
    VariationItemsList,
    IProps as IProps_VariationItemsList,
} from '../VariationItemsList/VariationItemsList';
import { SkuList, IProps as IProps_SkuList } from '../SkuList/SkuList';
import { FORM_ELEMENT_THEME } from '../FormElementBase/FormElementBase';
import { ZohoNumber, IProps as IProps_Number_Zoho } from '../Number/zohoNumber';
import { ZohoSelect, IProps as IProps_Select_Zoho } from '../Select/zohoSelect';
import {
    ZohoCheckBox,
    IProps as IProps_CheckBox_Zoho,
} from '../CheckBox/zohoCheckBox';

import {
    ZohoPercentage,
    IProps as IProps_Percentage_Zoho,
} from '../Percentage/zohoPercentage';

import {
    ZohoCurreny,
    IProps as IProps_Currency_Zoho,
} from '../Currency/zohoCurrency';

import {
    ZohoPhoneNumberInput,
    IProps as IProps_PhoneNumber_Zoho,
} from '../PhoneNumberInput/zohoPhoneNumberInput';
import { SwitchToggle, IProps as IProps_Switch } from '../Switch/Switch';
import {
    ZohoSkuListGenerator,
    IProps as IProps_SkuListGenerator_Zoho,
} from '../SkuListGenerator/zohoSkuListGenerator';

export enum APP_FORM_CONTROL {
    INPUT = 'INPUT',
    NUMBER = 'NUMBER',
    TEXTAREA = 'TEXTAREA',
    SELECT = 'SELECT',
    RANGESLIDER = 'RANGESLIDER',
    SLIDER = 'SLIDER',
    CHECKBOX = 'CHECKBOX',
    RADIOBUTTON = 'RADIOBUTTON',
    ASYNCSELECT = 'ASYNCSELECT',
    MULTILANGUAGE_INPUT = 'MULTILANGUAGE_INPUT',
    MULTILANGUAGE_TEXTAREA = 'MULTILANGUAGE_TEXTAREA',
    ATTRIBUTE_INPUT = 'ATTRIBUTE_INPUT',
    FILE_INPUT = 'FILE_INPUT',
    MULTI_FILE_INPUT = 'MULTI_FILE_INPUT',
    MULTILANGUAGE_INPUT_LIST = 'MULTILANGUAGE_INPUT_LIST',
    TAG_SELECT = 'TAG_SELECT',
    MAP = 'MAP',
    PHONE_LIST = 'PHONE_LIST',
    SKU_LIST = 'SKU_LIST',
    VARIATION_ITEMS_LIST = 'VARIATION_ITEMS_LIST',
    DATE_TIME_PICKER = 'DATE_TIME_PICKER',
    LOOKUP = 'LOOKUP',
    SWITCH = 'SWITCH',
    PERCENTAGE = 'PERCENTAGE',
    CURRENCY = 'CURRENCY',
    SKU_LIST_GENERATOR = 'SKU_LIST_GENERATOR',
    PHONE_NUMBER = 'PHONE_NUMBER',
}

type TProps<T> =
    | IProps_Input<T>
    | IProps_Number<T>
    | IProps_Textarea<T>
    | IProps_Select<T>
    | IProps_RangeSlider<T>
    | IProps_SLider<T>
    | IProps_CheckBox<T>
    | IProps_RadioButton<T>
    | IProps_AsyncSelect<T>
    | IProps_MultiLangInput<T>
    | IProps_MultiLangTextarea<T>
    | IProps_FileInput<T>
    | IProps_MultiFileInput<T>
    | IProps_MultiLangInputList<T>
    | IProps_TagSelect<T>
    | IProps_Map<T>
    | IProps_PhoneList<T>
    | IProps_SkuList<T>
    | IProps_VariationItemsList<T>
    | IProps_Attribute<T>
    | IProps_DateTimePicker<T>
    | IProps_Switch<T>
    | IProps_Input_Zoho<T>
    | IProps_MultiLangInput_Zoho<T>
    // | IProps_Select_Theme<T>
    | IProps_AsyncSelect_Zoho<T>
    | IProps_DateTimePicker_Zoho<T>
    | IProps_ZohoLookup<T>
    | IProps_Textarea_Zoho<T>
    | IProps_Number_Zoho<T>
    | IProps_Select_Zoho<T>
    | IProps_CheckBox_Zoho<T>
    | IProps_Currency_Zoho<T>
    | IProps_Percentage_Zoho<T>
    | IProps_SkuListGenerator_Zoho<T>
    | IProps_PhoneNumber_Zoho<T>;

export class FormControl<T> extends React.Component<TProps<T>> {
    controlRender() {
        const { control, apptheme } = this.props;
        switch (control) {
            case APP_FORM_CONTROL.INPUT:
                return apptheme === FORM_ELEMENT_THEME.ZOHO ? (
                    <ZohoInput {...(this.props as IProps_Input_Zoho<T>)} />
                ) : (
                    <Input {...(this.props as IProps_Input<T>)} />
                );
            case APP_FORM_CONTROL.NUMBER:
                return apptheme === FORM_ELEMENT_THEME.ZOHO ? (
                    <ZohoNumber {...(this.props as IProps_Number_Zoho<T>)} />
                ) : (
                    <Number {...(this.props as IProps_Number<T>)} />
                );
            case APP_FORM_CONTROL.TEXTAREA:
                return apptheme === FORM_ELEMENT_THEME.ZOHO ? (
                    <ZohoTextarea
                        {...(this.props as IProps_Textarea_Zoho<T>)}
                    />
                ) : (
                    <Textarea {...(this.props as IProps_Textarea<T>)} />
                );
            case APP_FORM_CONTROL.SELECT:
                return apptheme === FORM_ELEMENT_THEME.ZOHO ? (
                    <ZohoSelect {...(this.props as IProps_Select_Zoho<T>)} />
                ) : (
                    <Select {...(this.props as IProps_Select<T>)} />
                );
            case APP_FORM_CONTROL.CHECKBOX:
                return apptheme === FORM_ELEMENT_THEME.ZOHO ? (
                    <ZohoCheckBox
                        {...(this.props as IProps_CheckBox_Zoho<T>)}
                    />
                ) : (
                    <CheckBox {...(this.props as IProps_CheckBox<T>)} />
                );
            case APP_FORM_CONTROL.RANGESLIDER:
                return (
                    <RangeSlider {...(this.props as IProps_RangeSlider<T>)} />
                );
            case APP_FORM_CONTROL.SLIDER:
                return <Slider {...(this.props as IProps_SLider<T>)} />;
            case APP_FORM_CONTROL.RADIOBUTTON:
                return (
                    <RadioButton {...(this.props as IProps_RadioButton<T>)} />
                );
            case APP_FORM_CONTROL.ASYNCSELECT:
                return apptheme === FORM_ELEMENT_THEME.ZOHO ? (
                    <ZohoInputAsyncSelect
                        {...(this.props as IProps_AsyncSelect_Zoho<T>)}
                    />
                ) : (
                    <AsyncSelect {...(this.props as IProps_AsyncSelect<T>)} />
                );
            case APP_FORM_CONTROL.MULTILANGUAGE_INPUT:
                return apptheme === FORM_ELEMENT_THEME.ZOHO ? (
                    <ZohoMultiLangInput
                        {...(this.props as IProps_MultiLangInput_Zoho<T>)}
                    />
                ) : (
                    <MultiLangInput
                        {...(this.props as IProps_MultiLangInput<T>)}
                    />
                );
            case APP_FORM_CONTROL.MULTILANGUAGE_TEXTAREA:
                return (
                    <MultiLangTextarea
                        {...(this.props as IProps_MultiLangTextarea<T>)}
                    />
                );
            case APP_FORM_CONTROL.ATTRIBUTE_INPUT:
                return (
                    <AttributeInput {...(this.props as IProps_Attribute<T>)} />
                );
            case APP_FORM_CONTROL.FILE_INPUT:
                return <FileInput {...(this.props as IProps_FileInput<T>)} />;
            case APP_FORM_CONTROL.MULTI_FILE_INPUT:
                return (
                    <MultiFileInput
                        {...(this.props as IProps_MultiFileInput<T>)}
                    />
                );
            case APP_FORM_CONTROL.MULTILANGUAGE_INPUT_LIST:
                return (
                    <MultiLangInputList
                        {...(this.props as IProps_MultiLangInputList<T>)}
                    />
                );
            case APP_FORM_CONTROL.TAG_SELECT:
                return <TagSelect {...(this.props as IProps_TagSelect<T>)} />;
            case APP_FORM_CONTROL.MAP:
                return <AppMap {...(this.props as IProps_Map<T>)} />;
            case APP_FORM_CONTROL.PHONE_LIST:
                return <PhoneList {...(this.props as IProps_PhoneList<T>)} />;
            case APP_FORM_CONTROL.VARIATION_ITEMS_LIST:
                return (
                    <VariationItemsList
                        {...(this.props as IProps_VariationItemsList<T>)}
                    />
                );
            case APP_FORM_CONTROL.SKU_LIST:
                return <SkuList {...(this.props as IProps_SkuList<T>)} />;
            case APP_FORM_CONTROL.DATE_TIME_PICKER:
                return apptheme === FORM_ELEMENT_THEME.ZOHO ? (
                    <ZohoDateTimePicker
                        {...(this.props as IProps_DateTimePicker_Zoho<T>)}
                    />
                ) : (
                    <DateTimePicker
                        {...(this.props as IProps_DateTimePicker<T>)}
                    />
                );
            case APP_FORM_CONTROL.LOOKUP:
                return <ZohoLookup {...(this.props as IProps_ZohoLookup<T>)} />;
            case APP_FORM_CONTROL.SWITCH:
                return <SwitchToggle {...(this.props as IProps_Switch<T>)} />;

            case APP_FORM_CONTROL.PERCENTAGE:
                return apptheme === FORM_ELEMENT_THEME.ZOHO ? (
                    <ZohoPercentage
                        {...(this.props as IProps_Percentage_Zoho<T>)}
                    />
                ) : (
                    <></>
                );
            case APP_FORM_CONTROL.CURRENCY:
                return apptheme === FORM_ELEMENT_THEME.ZOHO ? (
                    <ZohoCurreny {...(this.props as IProps_Currency_Zoho<T>)} />
                ) : (
                    <></>
                );
            case APP_FORM_CONTROL.SKU_LIST_GENERATOR:
                return apptheme === FORM_ELEMENT_THEME.ZOHO ? (
                    <ZohoSkuListGenerator
                        {...(this.props as IProps_SkuListGenerator_Zoho<T>)}
                    />
                ) : (
                    <></>
                );

            case APP_FORM_CONTROL.PHONE_NUMBER:
                return apptheme === FORM_ELEMENT_THEME.ZOHO ? (
                    <ZohoPhoneNumberInput
                        {...(this.props as IProps_PhoneNumber_Zoho<T>)}
                    />
                ) : (
                    <></>
                );
            default:
                return null;
        }
    }

    render() {
        return this.controlRender();
    }
}
