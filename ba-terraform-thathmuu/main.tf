terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "dvopsBrainAcademy" {
  name     = "dvopsBrainAcademy"
  location = "East US"
}

resource "azurerm_kubernetes_cluster" "dvopsAKSCluster" {
  name                = "dvopsAKSCluster"
  location            = azurerm_resource_group.dvopsBrainAcademy.location
  resource_group_name = azurerm_resource_group.dvopsBrainAcademy.name
  dns_prefix          = "brainacademy-aks"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_DS2_v2"
  }

  service_principal {
    client_id     = "f659181b-dae1-4aff-8cf7-1f2cbc4d3719"
    client_secret = "Qv-8Q~bf7js_BAwH7IyInBR9-jHBvL0wltr3YcQs"
  }
}