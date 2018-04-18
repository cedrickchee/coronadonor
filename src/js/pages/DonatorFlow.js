/*** IMPORTS ***/
// Module imports
import React, { Fragment } from "react"
import Icon from "@fortawesome/react-fontawesome"
import { faICursor, faCreditCard, faMoneyBillAlt } from "@fortawesome/fontawesome-free-solid"
import { faPaypal, faEthereum } from "@fortawesome/fontawesome-free-brands"


// Local JS
import Page from "./Page"

// Local JS Utilities
import Database from "../resources/Database"
/*** [end of imports] ***/

export default class DonatorFlow extends Page {
  constructor(props) {
    super(props)

    this.state = {
      scenarioData: null,
      pageStyle: "flow",
      title: "Donate",
      navMenu: false,
      userId: 1,
      scenarioId: this.props.match.params.scenarioId || 1,
      refreshes: 0,
      donationAmount: 0
    }
    this.inputs = [
      {
        inputType: "radio-row",
        requiredField: true,
        labelPhrase: "Donation amount",
        radioRowName: "donation-amount-options",
        radios: [
          {
            inputID: "preset-amount",
            labelPhrase: "$3",
            onChange: this.toggleCustomDonationAmount,
            onChangeVal: false
          },
          {
            inputID: "remaining-amount",
            labelPhrase: `Remainder of project ($${this.calculateRemainder()})`,
            onChange: this.toggleCustomDonationAmount,
            onChangeVal: false
          },
          {
            inputID: "custom-amount",
            labelPhrase: "Custom",
            onChange: this.toggleCustomDonationAmount,
            onChangeVal: true
          }
        ]
      },
      {
        inputType: "number",
        inputID: "custom-amount-value",
        labelPhrase: "Custom amount",
        labelIcon: faICursor,
        requiredField: false,
        disabledField: true
      },
      { inputType: "hr" },
      {
        inputType: "radio-row",
        labelPhrase: "Payment Method",
        requiredField: true,
        radioRowName: "payment-method-options",
        radios: [
          {
            inputID: "paypal",
            labelPhrase: "PayPal",
            onChange: this.togglePaymentTypeFields,
            onChangeVal: 1
          },
          {
            inputID: "lion-bucks",
            labelPhrase: "Lion-Bucks",
            onChange: this.togglePaymentTypeFields,
            onChangeVal: 2
          },
          {
            inputID: "credit-card",
            labelPhrase: "Credit Card",
            onChange: this.togglePaymentTypeFields,
            onChangeVal: 3
          }
        ]
      },
      {
        inputType: "custom",
        toggleGroup: 1,
        disabledField: true,
        customJSX: (
          <Fragment>
            <div className="pseudo-input btn paypal-donate-btn">
              <a
                href="https://www.paypal.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="input-label-phrase">Donate via Paypal </span>
                <Icon icon={faPaypal} className="input-label-icon" />
              </a>
            </div>
          </Fragment>
        )
      },
      {
        inputType: "custom",
        toggleGroup: 2,
        disabledField: true,
        customJSX: (
          <Fragment>
            <label className="input-label">
              <span className="input-label-phrase">Ethereum wallet ID</span>
              <Icon icon={faEthereum} className="input-label-icon" />
            </label>
            <div className="pseudo-input">
              <div className="ethereum-wallet-id-transaction-number">
                <span className="wallet-id" id="walletID">
                  0x123f681646d4a755815f9cb19e1acc8565a0c2ac
                </span>
                <Icon className="copy-icon" icon="copy" />
              </div>
            </div>
          </Fragment>
        )
      },
      {
        inputType: "number",
        inputID: "cc-number",
        labelPhrase: "Credit card number",
        labelIcon: faCreditCard,
        toggleGroup: 3,
        requiredField: false,
        disabledField: true
      },
      {
        inputType: "split-input",
        labelPhrase: "Expiration",
        toggleGroup: 3,
        requiredField: false,
        disabledField: true,
        inputs: [
          {
            inputType: "number",
            inputID: "cc-expiration-month",
            labelPhrase: "Month"
          },
          {
            inputType: "number",
            inputID: "cc-expiration-year",
            labelPhrase: "Year"
          }
        ]
      },
      {
        inputType: "number",
        inputID: "cc-sec",
        labelPhrase: "Security number",
        toggleGroup: 3,
        requiredField: false,
        disabledField: true
      },
      {
        inputType: "submit",
        labelPhrase: "Donate",
        labelIcon: faMoneyBillAlt,
        onSubmit: this.submitDonation,
        onSubmitParams: {
          presetAmount: "donator_preset-amount",
          remainingAmount: "donator_remaining-amount",
          customAmount: "donator_custom-amount",
          customAmountValue: "donator_custom-amount-value",
          paypal: "donator_paypal",
          lionBucks: "donator_lion-bucks",
          creditCard: "donator_credit-card",
          creditCardNumber: "donator_cc-number",
          creditCardMonth: "donator_cc-expiration-month",
          creditCardYear: "donator_cc-expiration-year",
          creditCardSec: "donator_cc-sec"
        },
        responseType: "neutral"
      }
    ]

    this.calculateRemainder()
  }

  toggleCustomDonationAmount = turnedOn => {
    if (turnedOn) {
      this.inputs[1].requiredField = true
      this.inputs[1].disabledField = false
    } else {
      this.inputs[1].requiredField = false
      this.inputs[1].disabledField = true
    }

    this.setState({
      refreshes: this.state.refreshes + 1
    })
  }
  togglePaymentTypeFields = turnedOn => {
    for (let i = 4, l = this.inputs.length; i < l; i++) {
      if (this.inputs[i].toggleGroup === turnedOn) {
        this.inputs[i].requiredField = true
        this.inputs[i].disabledField = false
      } else {
        this.inputs[i].requiredField = false
        this.inputs[i].disabledField = true
      }
    }

    this.setState({
      refreshes: this.state.refreshes + 1
    })
  }
  submitDonation = params => {
    const { scenarioId, userId } = this.state

    let json = {
      data: {
        type: "donations",
        attributes: {
          amount: this.donationAmount(params)
        },
        relationships: {
          donator: {
            data: {
              type: "users",
              id: userId || "1"
            }
          },
          scenario: {
            data: {
              type: "scenarios",
              id: scenarioId
            }
          }
        }
      }
    }

    Database.createDonation(json)
      .then(result => {
        console.log("Donation successfully created:", result)

        this.props.history.push(`/${scenarioId}/thanks`)
      })
      .catch(error => {
        console.error("Error creating donation:", error)
      })
  }
  donationAmount = params => {
    if (params.presetAmount === "true") return 3
    else if (params.remainingAmount === "true") return this.state.donationAmount
    else if (params.customAmount === "true") return params.customAmountValue
    return 0
  }
  calculateRemainder = () => {
    const { scenarioData } = this.state

    if (scenarioData) {
      let remainder =
        parseInt(scenarioData.attributes.funding_goal, 10) -
        parseInt(scenarioData.attributes.donated, 10)

      this.inputs[0].radios[1].labelPhrase = `Remainder of project ($${remainder})`
      this.setState({
        donationAmount: remainder
      })
    } else {
      setTimeout(() => {
        this.calculateRemainder()
      }, 100)
    }
  }
}
