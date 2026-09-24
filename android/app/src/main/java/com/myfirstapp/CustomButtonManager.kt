package com.myfirstapp

import android.graphics.Color
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.common.MapBuilder

class CustomButtonManager : SimpleViewManager<CustomButton>() {

    override fun getName() = "CustomButton"

    override fun createViewInstance(reactContext: ThemedReactContext): CustomButton {
        return CustomButton(reactContext)
    }

    @ReactProp(name = "text")
    fun setText(view: CustomButton, text: String?) {
        view.text = text
    }

    @ReactProp(name = "color", customType = "Color")
    fun setColor(view: CustomButton, color: Int?) {
        if (color != null) {
            view.setBackgroundColor(color)
        }
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any>? {
        return mutableMapOf(
            "onCustomClick" to mutableMapOf("registrationName" to "onCustomClick")
        )
    }
}
