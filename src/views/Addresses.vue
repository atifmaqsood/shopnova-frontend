<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="display-1 mb-6">My Addresses</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn color="primary" @click="showAddDialog = true" class="mb-4">
          <v-icon left>mdi-plus</v-icon>
          Add New Address
        </v-btn>
      </v-col>
    </v-row>

    <!-- Addresses List -->
    <v-row v-if="addresses.length > 0">
      <v-col
        v-for="address in addresses"
        :key="address.id"
        cols="12"
        md="6"
      >
        <v-card>
          <v-card-text>
            <div class="d-flex justify-space-between align-center mb-2">
              <h3>{{ address.street }}</h3>
              <v-chip v-if="address.isDefault" small color="primary">
                Default
              </v-chip>
            </div>
            <p class="mb-1">{{ address.city }}, {{ address.state }}</p>
            <p class="mb-1">{{ address.zipCode }}</p>
            <p>{{ address.country }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" @click="editAddress(address)">
              Edit
            </v-btn>
            <v-btn text color="success" @click="setDefault(address.id)" v-if="!address.isDefault">
              Set Default
            </v-btn>
            <v-spacer />
            <v-btn text color="error" @click="deleteAddress(address.id)">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else>
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey">mdi-map-marker-outline</v-icon>
        <h3 class="grey--text mb-4">No addresses found</h3>
        <v-btn color="primary" @click="showAddDialog = true">
          Add Your First Address
        </v-btn>
      </v-col>
    </v-row>

    <!-- Add/Edit Address Dialog -->
    <v-dialog v-model="showAddDialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ editingAddress ? 'Edit Address' : 'Add New Address' }}
        </v-card-title>
        <v-card-text>
          <ValidationObserver ref="observer">
            <v-form>
              <ValidationProvider v-slot="{ errors }" name="street" rules="required">
                <v-text-field
                  v-model="addressForm.street"
                  label="Street Address"
                  :error-messages="errors"
                  outlined
                />
              </ValidationProvider>

              <v-row>
                <v-col cols="6">
                  <ValidationProvider v-slot="{ errors }" name="city" rules="required">
                    <v-text-field
                      v-model="addressForm.city"
                      label="City"
                      :error-messages="errors"
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="6">
                  <ValidationProvider v-slot="{ errors }" name="state" rules="required">
                    <v-text-field
                      v-model="addressForm.state"
                      label="State"
                      :error-messages="errors"
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6">
                  <ValidationProvider v-slot="{ errors }" name="zipCode" rules="required">
                    <v-text-field
                      v-model="addressForm.zipCode"
                      label="ZIP Code"
                      :error-messages="errors"
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="6">
                  <ValidationProvider v-slot="{ errors }" name="country" rules="required">
                    <v-text-field
                      v-model="addressForm.country"
                      label="Country"
                      :error-messages="errors"
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
              </v-row>

              <v-checkbox
                v-model="addressForm.isDefault"
                label="Set as default address"
              />
            </v-form>
          </ValidationObserver>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" :loading="saving" @click="saveAddress">
            {{ editingAddress ? 'Update' : 'Save' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Addresses',
  data() {
    return {
      showAddDialog: false,
      editingAddress: null,
      saving: false,
      addressForm: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false
      }
    }
  },
  computed: {
    ...mapGetters({
      addresses: 'user/addresses'
    })
  },
  created() {
    this.$store.dispatch('user/fetchAddresses')
  },
  methods: {
    editAddress(address) {
      this.editingAddress = address
      this.addressForm = { ...address }
      this.showAddDialog = true
    },
    async saveAddress() {
      this.saving = true
      try {
        if (this.editingAddress) {
          await this.$store.dispatch('user/updateAddress', {
            id: this.editingAddress.id,
            data: this.addressForm
          })
        } else {
          await this.$store.dispatch('user/createAddress', this.addressForm)
        }
        this.$store.dispatch('ui/showSnackbar', {
          message: `Address ${this.editingAddress ? 'updated' : 'created'} successfully!`,
          color: 'success'
        })
        this.closeDialog()
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Failed to save address',
          color: 'error'
        })
      } finally {
        this.saving = false
      }
    },
    async setDefault(id) {
      try {
        await this.$store.dispatch('user/setDefaultAddress', id)
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Default address updated!',
          color: 'success'
        })
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Failed to update default address',
          color: 'error'
        })
      }
    },
    async deleteAddress(id) {
      if (confirm('Are you sure you want to delete this address?')) {
        try {
          await this.$store.dispatch('user/deleteAddress', id)
          this.$store.dispatch('ui/showSnackbar', {
            message: 'Address deleted successfully!',
            color: 'success'
          })
        } catch (error) {
          this.$store.dispatch('ui/showSnackbar', {
            message: 'Failed to delete address',
            color: 'error'
          })
        }
      }
    },
    closeDialog() {
      this.showAddDialog = false
      this.editingAddress = null
      this.addressForm = {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false
      }
    }
  }
}
</script>