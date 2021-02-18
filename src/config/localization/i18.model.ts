import { GENDER } from '../../enum/gender.enum';
import { VARIATION_TYPE } from '../../enum/variation-type.enum';

export interface II18 {
    login: string;
    register: string;
    sign_in: string;
    sign_out: string;
    app_title: string;
    app_title_: string;
    dashboard: string;
    forgot_password: string;
    msg: {
        ui: {
            action_succeeded: string;
            error_occurred: string;
            error_occurred_retry_again: string;
            no_network_connection: string;
            new_vesion_available_update: string;
            item_will_be_removed_continue: string;
            file_could_not_be_uploaded: string;
            file_could_not_be_uploaded_max_size_n: string;
            profile_img_not_uploaded_max_size_n: string;
            one_img_upload_allowed_remove_existing_one: string;
            login_again: string;
            no_default_lang_create: string;
        };
        back: {};
    };
    validation: {
        min_length: string;
        mobile_format: string;
        smsCode_format: string;
        confirm_password: string;
        slug: string;
        email_format: string;
        phone_format: string;
        password_format: string;
        required_field: string;
    };
    username: string;
    password: string;
    name: string;
    lastname: string;
    phone: string;
    address: string;
    mobile: string;
    email: string;
    confirm_password: string;
    old_password: string;
    new_password: string;
    confirm_new_password: string;
    show_password: string;
    register_your_mobile_number: string;
    submit: string;
    verification_code_sended_via_sms_submit_here: string;
    verification_code: string;
    create_an_account: string;
    send_again: string;
    send_again_activationCode: string;
    in: string;
    second: string;
    search: string;
    home: string;
    library: string;
    more: string;
    loading_with_dots: string;
    retry: string;
    title: string;
    // return: string;
    reset_password: string;
    log_out: string;
    sync: string;
    syncing: string;
    syncing_with_dots: string;
    last_synced_on: string;
    settings: string;
    info: string;
    length: string;
    pages: string;
    description: string;
    follow: string;
    unfollow: string;
    see_more: string;
    see_less: string;
    format: string;
    helpful: string;
    report: string;
    all: string;
    of: string;
    from: string;
    to: string;
    previous: string;
    next: string;
    no_item_found: string;
    was: string;
    by: string;
    load_more: string;
    remove: string;
    minute: string;
    hour: string;
    close: string;
    app_info: string;
    version: string;
    version_mode: string;
    trial_mode: string;
    trial: string;
    update: string;
    shopping_cart: string;
    buy: string;
    price: string;
    total_price: string;
    recalculate: string;
    cancel: string;
    ok: string;
    create: string;
    save_and_new: string;
    rename: string;
    download: string;
    downloading: string;
    add: string;
    selected: string;
    select_all: string;
    deselect_all: string;
    sales_id: string;
    profile: string;
    profile_image: string;
    exist_in_library: string;
    preview: string;
    drag_and_drop: string;
    choose_image: string;
    goto: string;
    go: string;
    page_not_found: string;
    detail: string;
    count: string;
    unit_price: string;
    type: string;
    text_size: string;
    theme: string;
    font: string;
    refund_amount: string;
    vendor_name: string;
    refund_type: string;

    font_obj: {
        nunito: string;
    };
    increase_credit: string;
    increase_your_account: string;
    wrong_price: string;
    payment: string;
    existing_credit: string;

    change_password: string;
    storage: string;
    state: string;
    confirm: string;
    clear: string;
    unknown: string;
    operating_system: string;
    browser: string;
    device: string;
    zoom: string;
    reload_app: string;
    compatible_browsers: string;
    app_compatible_browsers_: string;

    person: string;
    person_manage: string;
    person_create: string;
    person_update: string;
    person_copy: string;
    stateForm: string;
    copy: string;
    save: string;

    reset: string;

    status: string;

    row: string;
    number: string;
    available: string;
    edit: string;
    unavailable: string;
    back: string;
    new_email: string;
    new_phone: string;
    next_Step: string;
    prev_Step: string;
    reset_email: string;
    reset_phone: string;
    on: string;
    off: string;
    actions: string;
    resume: string;
    active: string;
    inactive: string;
    size: string;
    logo: string;
    date: string;
    and: string;
    amount: string;
    months: string;
    value: string;

    language: string;
    language_manage: string;
    language_create: string;
    language_update: string;
    language_copy: string;
    language_view: string;

    view: string;
    reload: string;
    set_as_default: string;
    direction: string;
    rtl: string;
    ltr: string;
    goto_update: string;

    brand: string;
    brand_manage: string;
    brand_create: string;
    brand_update: string;
    brand_copy: string;
    brand_view: string;

    category: string;
    category_manage: string;
    category_create: string;
    category_update: string;
    category_copy: string;
    category_view: string;

    country: string;
    country_manage: string;
    country_create: string;
    country_update: string;
    country_copy: string;
    country_view: string;

    store: string;
    store_manage: string;
    store_create: string;
    store_update: string;
    store_copy: string;
    store_view: string;

    show_more: string;
    show_less: string;

    vendor: string;

    parent: string;
    image: string;
    choose_language: string;
    other_languages: string;

    currency: string;
    code: string;
    currencySymbol: string;

    area: string;
    area_manage: string;
    area_create: string;
    area_update: string;
    area_copy: string;
    area_view: string;

    warehouse: string;
    warehouse_manage: string;
    warehouse_create: string;
    warehouse_update: string;
    warehouse_copy: string;
    warehouse_view: string;

    variation: string;
    variation_manage: string;
    variation_create: string;
    variation_update: string;
    variation_copy: string;
    variation_view: string;

    item: string;
    items: string;

    attribute: string;
    attribute_manage: string;
    attribute_create: string;
    attribute_update: string;
    attribute_copy: string;
    attribute_view: string;

    product: string;
    product_manage: string;
    product_create: string;
    product_update: string;
    product_copy: string;
    product_view: string;

    slug: string;
    generate_Sku: string;
    get_sku_list: string;

    user: string;
    user_manage: string;
    user_create: string;
    user_update: string;
    user_copy: string;
    user_view: string;

    refund: string;
    refund_manage: string;
    refund_create: string;
    refund_update: string;
    refund_copy: string;
    refund_view: string;

    customer: string;

    gender: string;

    variation_type: {
        [key in VARIATION_TYPE]: string;
    };

    gender_type: {
        [key in GENDER]: string;
    };

    order: string;
    order_manage: string;
    order_create: string;
    order_update: string;
    order_copy: string;
    order_view: string;

    tag: string;
    tag_manage: string;
    tag_create: string;
    tag_update: string;
    tag_copy: string;
    tag_view: string;

    coupon: string;
    coupon_manage: string;
    coupon_create: string;
    coupon_update: string;
    coupon_copy: string;
    coupon_view: string;

    badge: string;
    badge_manage: string;
    badge_create: string;
    badge_update: string;
    badge_copy: string;
    badge_view: string;

    docAccount: string;
    docAccount_manage: string;
    docAccount_create: string;
    docAccount_update: string;
    docAccount_copy: string;
    docAccount_view: string;

    return: string;
    return_manage: string;
    return_create: string;
    return_update: string;
    return_copy: string;
    return_view: string;

    purshase: string;
    purshase_manage: string;
    purshase_create: string;
    purshase_update: string;
    purshase_copy: string;
    purshase_view: string;

    purchaseReturn: string;
    purchaseReturn_manage: string;
    purchaseReturn_create: string;
    purchaseReturn_update: string;
    purchaseReturn_copy: string;
    purchaseReturn_view: string;

    contact: string;
    contact_manage: string;
    contact_create: string;
    contact_update: string;
    contact_copy: string;
    contact_view: string;

    adjustment: string;
    adjustment_manage: string;
    adjustment_create: string;
    adjustment_update: string;
    adjustment_copy: string;
    adjustment_view: string;

    purchaseOrder: string;
    purchaseOrder_manage: string;
    purchaseOrder_create: string;
    purchaseOrder_update: string;
    purchaseOrder_copy: string;
    purchaseOrder_view: string;
}
